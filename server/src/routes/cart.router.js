import { Router } from "express";
import { addToCart, updateQuantity, removeFromCart, getCart } from "../controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.route('/add-to-cart').post(addToCart)
cartRouter.route('/update-quantity').patch(updateQuantity)
cartRouter.route('/remove-from-cart').delete(removeFromCart)
cartRouter.route('/get-cart/:userID').get(getCart)

export default cartRouter