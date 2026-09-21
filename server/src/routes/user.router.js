import {Router} from 'express'
import {registerUser, loginUser, logoutUser, changePassword, getCurrentUser, getAllUserDetails } from '../controllers/user.controller.js'
import verifyJWT, { verifyAdminJWT, verifyClientJWT } from '../middlewares/auth.middleware.js'
import isAdmin from '../middlewares/admin.middleware.js'

const userRouter = Router()

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(verifyJWT, logoutUser)
userRouter.route('/change-password').post(changePassword)
// verifyClientJWT: strictly reads accessToken only — never adminAccessToken.
// Prevents the admin session from bleeding into the client app on refresh.
userRouter.route('/me').get(verifyClientJWT, getCurrentUser)
// verifyAdminJWT: reads adminAccessToken only — for admin panel session verification.
// Keeps admin and client sessions fully isolated.
userRouter.route('/admin/me').get(verifyAdminJWT, isAdmin, getCurrentUser)
userRouter.route('/get-all-users').get(verifyAdminJWT, isAdmin, getAllUserDetails) 

export default userRouter 
