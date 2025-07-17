import { Cart } from '../models/cart.model.js'
import {Order }from '../models/order.model.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'

// place order
const placeUserOrder = asyncHandler(async(req,res)=>{
    
     const userID = req.user?._id;

    if (!userID) {
      throw new ApiError(404, "Register or login first before placing order")
     }

  const {name, address, phone, email, paymentMethod} = req.body
    if( !email && !name && !address && !phone){
        throw new ApiError(404, "All fields are required")
    }

    const cart = await Cart.findOne({userID}).populate({
      path: 'products.productID',
      select: 'name price gender productImage'
    });
    if(!cart || cart.products.length===0){
        throw new ApiError(404, "Cart is Empty")
    }

    const amount = cart.products.reduce((sum, item) => {
    return sum + (item.productID?.price || 0) * item.quantity;
  }, 0);

  const newOrder = await Order.create({
    userID,
    name,
    address,
    products:  cart.products,
    amount,
    phone,
    email,
    paymentMethod: paymentMethod || 'Cash on Delivery'
  })
  
  if(!newOrder){
      throw new ApiError(400, "Something went wrong while placing order")
  }

  cart.products= []
  await cart.save()

  return res
    .status(200)
    .json(
        new ApiResponse(200, newOrder, "Order Placed successfully!")
    )

})

// get user orders
const getUserOrders = asyncHandler(async(req,res)=>{
      const userID = req.user._id;

        const orders = await Order.find({userID})
        .populate({
          path: 'products.productID',
          select: 'name price gender productImage'
        });

        if (!orders || orders.length === 0){
            throw new ApiError(404, "Orders not found")
        }

         return res.status(200)
        .json(
            new ApiResponse(200, orders, "Orders fetched successfully")
        )
})

//get single order
const getSingleOrder = asyncHandler(async(req,res)=>{
    const {id} = req.params
        const orders = await Order.findById(id)
        .populate({
          path: 'products.productID',
          select: 'name price gender productImage'
        });
    
         if(!orders){
            throw new ApiError(404, "Orders not found")
        }

         return res.status(200)
        .json(
            new ApiResponse(200, orders, "Single Order fetched successfully")
        )
})

//update order status
const updateOrderStatus = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const {status} = req.body

    const orderStatus = await Order.findByIdAndUpdate(
         id,
        {status},
        {new: true}
    )
    if(!orderStatus){
        throw new ApiError(400, "Select or add order status to update")
    }
     return res.status(200)
        .json(
            new ApiResponse(200, orderStatus, "Order status updated successfully")
        )
})

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('userID', 'username email') // Populate basic user info
    .populate({
          path: 'products.productID',
          select: 'name price gender productImage'
        });       

  if (!orders || orders.length === 0) {
    throw new ApiError(404, "No orders found")
  }

  return res.status(200).json(
    new ApiResponse(200, orders, "All orders fetched successfully")
  );
});


export{placeUserOrder, getSingleOrder, getUserOrders, updateOrderStatus, getAllOrders}