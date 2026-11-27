import { Router } from "express";
import Guitar, { TYPES, CONDITIONS } from "../schema/guitarSchema.js";
import { protect } from "../middleware/auth.js";

let guitarRoute = Router()

const fail = (message, status = 400) => Object.assign(new Error(message), { status })
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// only these fields can be sent by the browser. "seller" is never one of them
const pickFields = (body) => {
    const { name, brand, type, condition, price, quantity, description, image } = body
    const fields = { name, brand, type, condition, price, quantity, description, image }
    Object.keys(fields).forEach((key) => fields[key] === undefined && delete fields[key])
    return fields
}

// the person who listed the guitar, or an admin, can change or remove it
const canManage = (user, guitar) => user.role === "admin" || String(guitar.seller) === String(user._id)

// GET /guitar?q=fender&type=Electric&condition=Good&sort=price-asc&page=1&limit=12
guitarRoute
    .route("/")
    .get(async (req, res) => {
        const { q, type, condition, sort } = req.query
        const page = Math.max(1, Number(req.query.page) || 1)
        const limit = Math.min(48, Math.max(1, Number(req.query.limit) || 12))

        const filter = {}
        if (q) {
            const search = { $regex: escapeRegex(String(q)), $options: "i" }
            filter.$or = [{ name: search }, { brand: search }]
        }
        if (TYPES.includes(type)) filter.type = type
        if (CONDITIONS.includes(condition)) filter.condition = condition

        const sorts = {
            newest: { _id: -1 },
            "price-asc": { price: 1 },
            "price-desc": { price: -1 },
        }

        const total = await Guitar.countDocuments(filter)
        const result = await Guitar.find(filter)
            .populate("seller", "name")
            .sort(sorts[sort] || sorts.newest)
            .skip((page - 1) * limit)
            .limit(limit)

        res.status(200).json({
            success: true,
            message: "Guitars read successfully",
            result: result,
            total: total,
            page: page,
            pages: Math.max(1, Math.ceil(total / limit)),
        })
    })
    // any logged in user can sell a guitar
    .post(protect, async (req, res) => {
        let result = await Guitar.create({ ...pickFields(req.body), seller: req.user._id })
        res.status(201).json({
            success: true,
            message: "Guitar listed successfully.",
            result: result,
        })
    })

// must stay above "/:id" or "mine" would be read as an id
guitarRoute
    .route("/mine")
    .get(protect, async (req, res) => {
        let result = await Guitar.find({ seller: req.user._id }).sort({ _id: -1 })
        res.status(200).json({
            success: true,
            message: "Your guitars read successfully",
            result: result,
        })
    })

guitarRoute
    .route("/:id")//localhost:8000/guitar/id
    .get(async (req, res) => {
        let result = await Guitar.findById(req.params.id).populate("seller", "name")
        if (!result) throw fail("Guitar not found.", 404)
        res.status(200).json({
            success: true,
            message: "Guitar read successfully",
            result: result,
        })
    })
    .patch(protect, async (req, res) => {
        let guitar = await Guitar.findById(req.params.id)
        if (!guitar) throw fail("Guitar not found.", 404)
        if (!canManage(req.user, guitar)) throw fail("You can only edit your own listings.", 403)

        guitar.set(pickFields(req.body))
        await guitar.save()
        res.status(200).json({
            success: true,
            message: "Guitar updated successfully",
            result: guitar,
        })
    })
    .delete(protect, async (req, res) => {
        let guitar = await Guitar.findById(req.params.id)
        if (!guitar) throw fail("Guitar not found.", 404)
        if (!canManage(req.user, guitar)) throw fail("You can only delete your own listings.", 403)

        await guitar.deleteOne()
        res.status(200).json({
            success: true,
            message: "Guitar deleted successfully",
            result: guitar,
        })
    })

export default guitarRoute
