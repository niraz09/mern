// change the store name here and it updates everywhere
export const STORE_NAME = "Strings&Harmony"

// these two lists must match the ones in Express/src/schema/guitarSchema.js
export const TYPES = ["Acoustic", "Electric", "Bass", "Classical", "Ukulele"]
export const CONDITIONS = ["New", "Like new", "Good", "Fair"]

export const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"]

export const money = (n) => `Rs. ${Number(n || 0).toLocaleString("en-IN")}`

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
