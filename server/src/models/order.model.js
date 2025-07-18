 import mongoose, {Schema} from "mongoose"

const ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({
	userID: {
		type: ObjectId,
		ref: 'User',
		required: true,
	},
	products: [
		{
			productID: {
				type: ObjectId,
				ref: 'Product',
				required: true,
			}, 
			quantity: { 
				type: Number, 
				default: 1,
			},
		},
	],

	// items: {
	// 	type: ObjectId,
	// 	ref: 'Cart',
	// },
    name:{
		type:String,
		required: true
	},
	amount: {
		type: Number,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	address: { 
		type: String, 
		required: true,
	},
	phone:{
		type: String,
		required: true,
	},
	paymentMethod: {
        type: String,
        enum: ['Cash on Delivery', 'Credit Card', 'Easypaisa'],
        default: 'Cash on Delivery',
    },
	status: {
		type: String,
		enum: ['Delivered', 'Cancelled', 'Pending'],
		default: "Pending",
	},
}, 
	{timestamps: true}
)

export const Order = mongoose.model("Order", orderSchema)