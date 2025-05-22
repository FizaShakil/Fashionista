import mongoose, {Schema} from "mongoose"

const ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({
	userID: {
		type: ObjectId,
		ref: 'User',
		required: true,
	},
	// products: [
	// 	{
	// 		productID: {
	// 			type: ObjectId,
	// 			ref: 'Product',
	// 			required: true,
	// 		}, 
	// 		quantity: { 
	// 			type: Number, 
	// 			default: 1,
	// 		},
	// 	},
	// ],
	items: {
		type: ObjectId,
		ref: 'Cart',
	},
	amount: {
		type: Number,
		required: true,
	},
	address: { 
		type: ObjectId, 
		required: true,
	},
	phone:{
		type: String,
		required: true,
	},
	status: {
		type: String,
		default: "pending",
	},
}, 
	{timestamps: true}
)

export const Order = mongoose.model("Order", orderSchema)