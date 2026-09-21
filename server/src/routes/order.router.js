import { Router } from "express";
import { placeUserOrder, getUserOrders, getSingleOrder, updateOrderStatus, getAllOrders } from "../controllers/order.controller.js";
import verifyJWT, { verifyAdminJWT, verifyClientJWT } from '../middlewares/auth.middleware.js'
import isAdmin from "../middlewares/admin.middleware.js";

const orderRouter = Router()

orderRouter.route('/place-order').post(verifyJWT, placeUserOrder)
// verifyClientJWT: reads accessToken only — never adminAccessToken.
// Prevents an admin session from accessing customer order history.
orderRouter.route('/get-user-orders').get(verifyClientJWT, getUserOrders)
orderRouter.route('/get-single-order/:id').get(verifyAdminJWT, isAdmin, getSingleOrder)
orderRouter.route('/admin/get-all-orders').get(verifyAdminJWT, isAdmin, getAllOrders)
orderRouter.route('/update-order-status/:id').patch(verifyAdminJWT, isAdmin, updateOrderStatus)

export default orderRouter