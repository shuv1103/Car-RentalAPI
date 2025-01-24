import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse} from "../utils/ApiResponse.js";
import { registerUser } from "../services/user.service.js";

// Add user to DB 
const addUser = asyncHandler(async(req,res)=>{
    registerUser(req.body)
})

// Get user by their ID
const getUserById = asyncHandler(async(req,res)=>{
    const {userId} = req.query 
    // console.log(userId) -> debug purpose
    const trimmedUserId = userId.trim() // to remove trailing spaces from "userId"
    // console.log(trimmedUserId) -> debug purpose
    const user = await User.findOne({userId: trimmedUserId})
    if(!user)
    {
        throw new ApiError(404,"User not found!")
    }
    return res.status(200).json({
        response: new ApiResponse(
            200,
            user,
            "User found successfully",
        )
    })
})

const getUserByEmail = asyncHandler(async(req,res)=>{
    const {email} = req.query
    const user = await User.findOne({email})
    if(!user)
    {
        throw new ApiError(404,"User not found!")
    }
    return res.status(200).json({
        response: new ApiResponse(
            200,
            user,
            "User found successfully",
        )
    })
})

export {addUser,getUserById,getUserByEmail}