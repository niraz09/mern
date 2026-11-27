import { model, Schema } from "mongoose"

export const TYPES = ["Acoustic", "Electric", "Bass", "Classical", "Ukulele"]
export const CONDITIONS = ["New", "Like new", "Good", "Fair"]

let guitarSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required."],
        trim: true,
    },
    brand: {
        type: String,
        required: [true, "brand is required."],
        trim: true,
    },
    type: {
        type: String,
        required: [true, "type is required."],
        enum: { values: TYPES, message: "type must be one of: " + TYPES.join(", ") + "." },
    },
    condition: {
        type: String,
        required: [true, "condition is required."],
        enum: { values: CONDITIONS, message: "condition must be one of: " + CONDITIONS.join(", ") + "." },
    },
    price: {
        type: Number,
        required: [true, "price is required."],
        min: [0, "price can't be negative."],
    },
    // a used guitar is usually 1, a shop selling new ones can have more
    quantity: {
        type: Number,
        default: 1,
        min: [0, "quantity can't be negative."],
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String, // image url
        trim: true,
    },
    // who is selling it. set by the server from the login token, never from the request body
    seller: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true })

let Guitar = model("Guitar", guitarSchema)
export default Guitar

/* 
guitar
    name        String
    brand       String
    type        Acoustic | Electric | Bass | Classical | Ukulele
    condition   New | Like new | Good | Fair
    price       Number
    quantity    Number
    seller      User
*/
