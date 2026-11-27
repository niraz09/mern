import { Router } from "express"
import Order, { STATUSES } from "../schema/orderSchema.js"
import Guitar from "../schema/guitarSchema.js"
import { protect, adminOnly } from "../middleware/auth.js"

let orderRoute = Router()

const fail = (message, status = 400) => Object.assign(new Error(message), { status })

orderRoute
    .route("/")
    // place an order. prices come from the database, never from the browser
    .post(protect, async (req, res) => {
        const { items, shipping } = req.body
        if (!Array.isArray(items) || items.length === 0) throw fail("Your cart is empty.")

        const details = {
            name: String(shipping?.name || "").trim(),
            phone: String(shipping?.phone || "").trim(),
            address: String(shipping?.address || "").trim(),
        }
        if (!details.name || !details.phone || !details.address) {
            throw fail("Name, phone and address are required.")
        }

        // merge repeated guitars and check quantities
        const wanted = new Map()
        for (const item of items) {
            const qty = Number(item.qty)
            if (!Number.isInteger(qty) || qty < 1) throw fail("Invalid quantity.")
            const id = String(item.guitar)
            wanted.set(id, (wanted.get(id) || 0) + qty)
        }

        const guitars = await Guitar.find({ _id: { $in: [...wanted.keys()] } })
        if (guitars.length !== wanted.size) throw fail("One or more guitars are no longer listed.")

        // nobody can buy their own listing
        for (const g of guitars) {
            if (String(g.seller) === String(req.user._id)) throw fail(`You can't buy your own guitar (${g.name}).`)
        }

        const lines = guitars.map((g) => ({
            guitar: g._id,
            seller: g.seller,
            name: g.name,
            price: g.price,
            qty: wanted.get(String(g._id)),
        }))

        // take stock one guitar at a time. the filter makes sure it never goes below zero,
        // and if any line fails, the ones already taken are put back
        const reserved = []
        try {
            for (const line of lines) {
                const taken = await Guitar.updateOne(
                    { _id: line.guitar, quantity: { $gte: line.qty } },
                    { $inc: { quantity: -line.qty } }
                )
                if (taken.modifiedCount === 0) throw fail(`${line.name} is no longer available.`)
                reserved.push(line)
            }

            const result = await Order.create({
                user: req.user._id,
                items: lines,
                total: lines.reduce((sum, line) => sum + line.price * line.qty, 0),
                shipping: details,
            })

            res.status(201).json({ success: true, message: "Order placed successfully.", result: result })
        } catch (error) {
            for (const line of reserved) {
                await Guitar.updateOne({ _id: line.guitar }, { $inc: { quantity: line.qty } })
            }
            throw error
        }
    })
    // admin: all orders
    .get(protect, adminOnly, async (req, res) => {
        let result = await Order.find().populate("user", "name email").sort({ _id: -1 })
        res.status(200).json({ success: true, message: "Orders read successfully", result: result })
    })

// must stay above "/:id"
orderRoute
    .route("/mine")
    .get(protect, async (req, res) => {
        let result = await Order.find({ user: req.user._id }).sort({ _id: -1 })
        res.status(200).json({ success: true, message: "Orders read successfully", result: result })
    })

// orders that contain guitars sold by the logged in user. the seller needs the delivery details to ship it,
// but only sees their own items, not what else the buyer ordered
orderRoute
    .route("/sales")
    .get(protect, async (req, res) => {
        const orders = await Order.find({ "items.seller": req.user._id }).sort({ _id: -1 })
        const result = orders.map((order) => {
            const items = order.items.filter((i) => String(i.seller) === String(req.user._id))
            return {
                _id: order._id,
                createdAt: order.createdAt,
                status: order.status,
                shipping: order.shipping,
                items: items,
                total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
            }
        })
        res.status(200).json({ success: true, message: "Sales read successfully", result: result })
    })

orderRoute
    .route("/:id")
    .get(protect, async (req, res) => {
        let result = await Order.findById(req.params.id).populate("user", "name email")
        const isOwner = result && String(result.user._id) === String(req.user._id)
        if (!result || (!isOwner && req.user.role !== "admin")) throw fail("Order not found.", 404)
        res.status(200).json({ success: true, message: "Order read successfully", result: result })
    })

orderRoute
    .route("/:id/status")
    .patch(protect, adminOnly, async (req, res) => {
        const { status } = req.body
        if (!STATUSES.includes(status)) throw fail("Invalid status.")

        const order = await Order.findById(req.params.id)
        if (!order) throw fail("Order not found.", 404)
        if (order.status === "cancelled" && status !== "cancelled") {
            throw fail("A cancelled order can't be reopened.")
        }

        // cancelling puts the guitars back on sale
        if (status === "cancelled" && order.status !== "cancelled") {
            for (const line of order.items) {
                await Guitar.updateOne({ _id: line.guitar }, { $inc: { quantity: line.qty } })
            }
        }

        order.status = status
        await order.save()
        res.status(200).json({ success: true, message: "Order status updated", result: order })
    })

export default orderRoute
