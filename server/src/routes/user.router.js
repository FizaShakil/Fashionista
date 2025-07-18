import {Router} from 'express'
import {registerUser, loginUser, logoutUser, changePassword, getCurrentUser, getAllUserDetails } from '../controllers/user.controller.js'
import verifyJWT from '../middlewares/auth.middleware.js'

const userRouter = Router()

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(verifyJWT, logoutUser)
userRouter.route('/change-password').post(changePassword)
userRouter.route('/me').get(verifyJWT, getCurrentUser)
userRouter.route('/get-all-users').get(getAllUserDetails)

export default userRouter