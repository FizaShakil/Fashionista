import mongoose, { Schema } from 'mongoose'

const productSchema = new Schema ({
    name:{
        type: String,
        required: true,
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
    category:{
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    imageLink:{
        type: String
    },
    newArrival:{
        type: Boolean
    }
})

export const Product = mongoose.model("Product" , productSchema)