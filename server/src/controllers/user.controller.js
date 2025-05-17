import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken =  user.generateAccessTokens()
        const refreshToken =  user.generateRefreshTokens()

        user.refreshToken = refreshToken

        await user.save(({
            validateBeforeSave: false
        })
    )
    return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    console.log(req.body)
    const {username, email, password} = req.body;
    console.log("email", email)

    //validation check that not any field will be empty
    if ([username, email, password].some((field) => !field?.trim()))
    {
        throw new ApiError(400, "All fields are required")
    }


const existedUser = await User.findOne({email})

if(existedUser){
    throw new ApiError(409, "User with email already exists")
}
// everythig working fine, create entry in db
const user = await User.create({
    username,
    email,
    password
})

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createdUser){
    throw new ApiError(400, "Something went wrong while registering the user")
}

return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Successfully!! ")
)

})

const loginUser = asyncHandler(async(req,res)=>{
     console.log("Incoming request", req.body)
    const {email, password} = req.body;

    if(!email){
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, "User not found")
    }
    
    console.log("userlogin email: ", email)
    // check password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user Credentials")
    }

    //generate access and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    console.log("Tokens Generated:", { accessToken, refreshToken });

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
    
    const options = {
        httpOnly: true,
        secure: false //become true on development
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully!! "
        )
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: false    // it will become true in production
    }

    return res.
    status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200, {}, "User Logged out successfully!"
        )
    )
})

const changePassword = asyncHandler(async(req,res)=>{
    const {email, oldPassword, newPassword} = req.body
    
    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(404, "User not found")
    }
    const isPasswordCorrect = await User.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password entered")
    }

    user.password = newPassword
    await user.save({
        validateBeforeSave: false
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,{}, "Password changed successfuly!! ")
    )
})
const getCurrentUser = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json({
          success: true,
          user: req.user,
        });
      } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong" });
      }
})
const getAllUserDetails = asyncHandler(async(req, res)=>{
    const {email} = req.body

     const users = await User.find({})
     .select("username email createdAt updatedAt")

     if(!users){
        throw new ApiError(500, "Something went wrong while fetching the users details")
     }

     return res
     .status(200)
     .json(
        new ApiResponse(200, users, "Users fetched successfully! ")
     )
})
export {registerUser, loginUser, logoutUser, generateAccessAndRefreshToken, changePassword, getCurrentUser, getAllUserDetails}