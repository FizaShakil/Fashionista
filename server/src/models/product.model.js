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
    }
})

export const Product = mongoose.model("Product" , productSchema)