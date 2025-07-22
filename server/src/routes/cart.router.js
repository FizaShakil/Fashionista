import { Router } from "express";
import { addToCart, updateQuantity, removeFromCart, getCart, syncCartController } from "../controllers/cart.controller.js";
import verifyJWT from '../middlewares/auth.middleware.js'
const cartRouter = Router()

cartRouter.route('/add-to-cart').post(verifyJWT, addToCart)
cartRouter.route('/update-quantity').patch(verifyJWT,updateQuantity)
cartRouter.route('/remove-from-cart').post(verifyJWT, removeFromCart)
cartRouter.route('/get-cart').get(verifyJWT, getCart)
cartRouter.route('/sync').post(verifyJWT, syncCartController)

export default cartRouter