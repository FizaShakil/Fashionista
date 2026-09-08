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
			// --- Phase 1: Price snapshot fields ---
			// unitPricePaid: null for all EXISTING (legacy) orders.
			// New orders (Phase 4+) will populate this at checkout.
			// NEVER backfill with calculated/guessed values.
			unitPricePaid: {
				type: Number,
				default: null
			},
			// productName snapshot: null for legacy orders.
			// Protects order display if a product is later deleted.
			productName: {
				type: String,
				default: null
			}
		},
	],
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
	// --- Phase 1: Order classification ---
	// Defaults to 'retail'. Wholesale orders will be classified in Phase 4.
	orderType: {
		type: String,
		enum: ['retail', 'wholesale'],
		default: 'retail'
	}
}, 
	{timestamps: true}
)

export const Order = mongoose.model("Order", orderSchema)