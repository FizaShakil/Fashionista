import { Router } from "express";
import { placeUserOrder,getUserOrders, getSingleOrder, updateOrderStatus, getAllOrders } from "../controllers/order.controller.js";
import verifyJWT, { verifyAdminJWT, verifyAnyJWT } from '../middlewares/auth.middleware.js'
import isAdmin from "../middlewares/admin.middleware.js";

const orderRouter = Router()

orderRouter.route('/place-order').post(verifyJWT, placeUserOrder)
orderRouter.route('/get-user-orders').get(verifyAnyJWT, getUserOrders)
orderRouter.route('/get-single-order/:id').get(verifyJWT, getSingleOrder)
orderRouter.route('/admin/get-all-orders').get(verifyAdminJWT,isAdmin, getAllOrders)
orderRouter.route('/update-order-status/:id').patch(verifyAdminJWT,isAdmin, updateOrderStatus)

export default orderRouter