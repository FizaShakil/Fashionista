import mongoose, { Schema } from 'mongoose'

const productSchema = new Schema ({
    name:{
        type: String,
        required: true,
    },
    productUniqueID:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    // Legacy price field — kept for backward compatibility.
    // Will remain in use by the frontend until the pricing engine is
    // introduced in Phase 3. Do NOT remove in this phase.
    price:{
        type: Number,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    productImage:{
        type: String  // cloudinary URL of image
    },
    newArrival:{
        type: Boolean
    },
    // --- Phase 1: B2B/B2C Pricing Fields ---
    retailRegularPrice: {
        type: Number,
        default: null   // Populated by migration from legacy `price`
    },
    retailSalePrice: {
        type: Number,
        default: null
    },
    wholesaleRegularPrice: {
        type: Number,
        default: null
    },
    wholesaleSalePrice: {
        type: Number,
        default: null
    },
    wholesaleMOQ: {
        type: Number,
        default: 1      // Minimum Order Quantity for wholesale customers
    },
    // --- Phase 1: Catalog Fields ---
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    colors: [{
        type: String
    }]
})

export const Product = mongoose.model("Product" , productSchema)