import { model, Schema } from "mongoose"

export const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"]

let orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // name, price and seller are copied at order time so old orders don't change when a listing is edited or deleted
    items: [{
        guitar: { type: Schema.Types.ObjectId, ref: "Guitar" },
        seller: { type: Schema.Types.ObjectId, ref: "User" },
        name: String,
        price: Number,
        qty: Number,
    }],
    total: {
        type: Number,
        required: true,
    },
    shipping: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },
    status: {
        type: String,
        enum: STATUSES,
        default: "pending",
    },
    paymentMethod: {
        type: String,
        default: "cash on delivery",
    },
}, { timestamps: true })

let Order = model("Order", orderSchema)
export default Order
