import { Cart } from "../models/cart.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from '../utils/asyncHandler.js'

//add to cart
const addToCart = asyncHandler(async(req,res)=>{
    const userID = req.user._id;
    const {productID } = req.body

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
    const userID = req.user._id;
    const {productID, action} = req.body

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
    const userID = req.user._id;
    const {productID} = req.body
    
    // console.log("Remove from cart request:", { userID, productID });
    
    const cart = await Cart.findOne({userID})

    if(!cart){
        throw new ApiError(404, "Cart not found")
    }
    
    // console.log("Cart before removal:", cart.products.length, "items");
    
    cart.products = cart.products.filter(p=> p.productID.toString() !== productID) // remove
    
    // console.log("Cart after removal:", cart.products.length, "items");
    
    await cart.save();
    return res.status(200)
    .json(
        new ApiResponse(200, cart, "Product removed successfully")
    )
})

//get cart
const getCart = asyncHandler(async(req,res)=>{

    const userID = req.user._id;
    const cart = await Cart.findOne({userID})
    .populate('products.productID').select('-description -productUniqueID');

    if (!cart) {
        return res.status(200)
        .json(
            new ApiResponse(200, { products: [] }, "Cart is empty")
        )
    }

     return res.status(200)
    .json(
        new ApiResponse(200, cart, "Products get successfully")
    )
})
const syncCartController = asyncHandler(async (req, res) => {
   const userID = req.user._id;
    const cartFromFrontend = req.body.cartItems; // expect array of full product objects
     
    // If cart is empty, just return success (no need to create empty cart)
     if (!Array.isArray(cartFromFrontend) || cartFromFrontend.length === 0) {
        return res.status(200)
        .json(
            new ApiResponse(200, { message: "No items to sync" }, "Cart sync completed")
        );
  }

       // Map to minimal schema: only productID and quantity
     const refinedProducts = cartFromFrontend.map((item) => ({
        productID: item._id || item.productID,
        quantity: item.quantity || 1,
    }));

     // Check if user already has a cart
   const existingCart = await Cart.findOne({ userID });

   if (existingCart) {
    // Replace existing cart with new data from frontend
     existingCart.products = refinedProducts;
     await existingCart.save();
  } 
   else {
    // Create new cart
    await Cart.create({
      userID,
      products: refinedProducts,
    });
  }

  res.status(200)
  .json(
    new ApiResponse(200, { message: "Cart synced successfully" }, "Cart synced successfully")
  );
});

export {addToCart, updateQuantity, removeFromCart, getCart, syncCartController}