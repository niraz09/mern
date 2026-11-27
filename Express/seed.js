// npm run seed
// creates an admin account, a demo seller and some sample guitars (only if there are none yet)

import "dotenv/config"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import connectToDb from "./src/connectToDb.js"
import User from "./src/schema/userSchema.js"
import Guitar from "./src/schema/guitarSchema.js"

// seller is "shop" (the admin account) or "demo" (the demo seller account)
const guitars = [
    { seller: "shop", name: "FG800 Acoustic", brand: "Yamaha", type: "Acoustic", condition: "New", price: 32000, quantity: 3, description: "Solid spruce top, dreadnought body. A warm, balanced sound that suits beginners and gigging players alike." },
    { seller: "shop", name: "Dreadnought D-10", brand: "Epiphone", type: "Acoustic", condition: "New", price: 24000, quantity: 2, description: "Full size dreadnought with a bright tone and comfortable neck. Ready to play out of the box." },
    { seller: "demo", name: "FA-100 Folk", brand: "Fender", type: "Acoustic", condition: "Good", price: 15500, quantity: 1, description: "Used for about two years. A few small marks on the back, no cracks. Strings changed last month." },
    { seller: "shop", name: "Les Paul Standard", brand: "Epiphone", type: "Electric", condition: "Like new", price: 68000, quantity: 1, description: "Honey burst finish, humbucker pickups and a thick, sustaining tone. Played only at home." },
    { seller: "demo", name: "Squier Stratocaster", brand: "Squier", type: "Electric", condition: "Good", price: 26500, quantity: 1, description: "Classic three single coil setup. Minor wear on the pickguard. Comes with a gig bag." },
    { seller: "shop", name: "Pacifica 112V", brand: "Yamaha", type: "Electric", condition: "New", price: 38000, quantity: 2, description: "Versatile HSS pickups and a smooth maple neck. A very popular first electric guitar." },
    { seller: "demo", name: "RG421 Electric", brand: "Ibanez", type: "Electric", condition: "Fair", price: 29000, quantity: 1, description: "Fast thin neck, great for rock and metal. Some scratches on the body, works perfectly." },
    { seller: "shop", name: "P Bass PJ", brand: "Squier", type: "Bass", condition: "New", price: 45000, quantity: 1, description: "Four string bass with a split and a single pickup for a thick, punchy low end." },
    { seller: "demo", name: "TRBX174 Bass", brand: "Yamaha", type: "Bass", condition: "Like new", price: 31000, quantity: 1, description: "Light and easy to play. Barely used, no dents or scratches." },
    { seller: "shop", name: "C40 Classical", brand: "Yamaha", type: "Classical", condition: "New", price: 14500, quantity: 4, description: "Nylon strings and a wide neck. The standard choice for learning classical and fingerstyle." },
    { seller: "demo", name: "Soprano Ukulele", brand: "Kala", type: "Ukulele", condition: "Good", price: 6500, quantity: 1, description: "Mahogany soprano ukulele with a sweet, bright sound. Includes a soft case." },
    { seller: "demo", name: "Stage Custom Acoustic", brand: "Cort", type: "Acoustic", condition: "Fair", price: 9800, quantity: 0, description: "Sold. Kept here as an example of a listing that is out of stock." },
]

await connectToDb()

const adminEmail = (process.env.ADMIN_EMAIL || "admin@stringsandharmony.com").toLowerCase()
const adminPassword = process.env.ADMIN_PASSWORD || "admin123"
let admin = await User.findOne({ email: adminEmail })
if (!admin) {
    admin = await User.create({ name: "Strings&Harmony Shop", email: adminEmail, password: await bcrypt.hash(adminPassword, 10), role: "admin" })
    console.log(`admin created: ${adminEmail} / ${adminPassword}`)
} else {
    console.log("admin already exists")
}

const demoEmail = "seller@stringsandharmony.com"
const demoPassword = "seller123"
let demo = await User.findOne({ email: demoEmail })
if (!demo) {
    demo = await User.create({ name: "Demo Seller", email: demoEmail, password: await bcrypt.hash(demoPassword, 10) })
    console.log(`demo seller created: ${demoEmail} / ${demoPassword}`)
} else {
    console.log("demo seller already exists")
}

if ((await Guitar.countDocuments()) === 0) {
    const owners = { shop: admin._id, demo: demo._id }
    await Guitar.insertMany(guitars.map(({ seller, ...rest }) => ({ ...rest, seller: owners[seller] })))
    console.log(`added ${guitars.length} guitars`)
} else {
    console.log("guitars already exist, skipped")
}

await mongoose.disconnect()
