import mongoose, { Schema } from 'mongoose'

const categorySchema = new Schema({
    name:{
        type: String,
        required: true
    },
    productId:[ //array of product iems which lay in the category
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    imageLink:{
        type: String,
        required: true
    }
})

export const Category = mongoose.model("Category", categorySchema)