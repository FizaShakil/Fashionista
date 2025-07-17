import { Cart } from "../models/cart.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from '../utils/asyncHandler.js'

//add to cart
const addToCart = asyncHandler(async(req,res)=>{
    const {userID, productID } = req.body

    let cart = await Cart.findOne({userID})
    if(!cart){
        cart = new Cart({userID, products:[{productID}]})
    }
    const existingProduct = cart.products.find(p=> p.productID.toString() === productID)

    if(existingProduct){
        existingProduct.quantity += 1;                     // If exists, increment quantity
    } 
    else {
      cart.products.push({ productID });                 // Else, add as a new item
    }

    await cart.save(); 

    return res.status(200)
    .json(
        new ApiResponse(200, cart, "Product added to cart succcessfully" )
    )
})

//increment/decrement product in cart {update quantity}
const updateQuantity = asyncHandler(async(req,res)=>{
    const {userID, productID, action} = req.body

    const cart = await Cart.findOne({userID})
    if(!cart){
        throw new ApiError(404, "Cart not found")
    }

    const item = cart.products.find(p=> p.productID.toString() === productID)
    if(!item){
        throw new ApiError(404, "Item not found in cart")
    }
    if(action === 'increment') item.quantity+=1
    if(action === 'decrement' && item.quantity>1) item.quantity -=1

    await cart.save();
    return res.status(200)
    .json(
        new ApiResponse(200, cart, "Quantity updated successfully")
    )

})

//delete product from cart
const removeFromCart = asyncHandler(async(req,res)=>{
    const {userID, productID} = req.body
    const cart = await Cart.findOne({userID})

    if(!cart){
        throw new ApiError(404, "Cart not found")
    }
    cart.products = cart.products.filter(p=> p.productID.toString() !== productID) // remove
    await cart.save();
    return res.status(200)
    .json(
        new ApiResponse(200, cart, "Product removed successfully")
    )
})

//get cart
const getCart = asyncHandler(async(req,res)=>{

    const {userID} = req.params
    const cart = await Cart.findOne({userID})
    .populate('products.productID').select('-description -productUniqueID');

     return res.status(200)
    .json(
        new ApiResponse(200, cart, "Products get successfully")
    )
})

export {addToCart, updateQuantity, removeFromCart, getCart}