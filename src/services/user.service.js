import { User } from "../models/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import bcrypt from "bcrypt"

const registerUser = asyncHandler(async(req,res)=>{
    // de-structure info from json req 
    const {name,email,password} = req.body

    // required fields validation(empty or null check)
    if([name,email,password].some(value => value == null || value.trim() === '')){
        throw new ApiError(400,"All fields are required")
    }

    
    // email format validation check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email))
    {
        throw new ApiError(400,"Email format incorrect!")
    }

    // password length validation check
    if(password.length < 6)
    {
        throw new ApiError(400,"Password must be of atleast 6 characters long!")
    }

    
    // Check if user already exists or not
    // $ - query operator
    const existedUser = await User.findOne({
        $or:[{name},{email}]
    })

    // User already exists
    if(existedUser)
    {
        throw new ApiError(400, "User already exists")
    }

    // Hash the user password
    // Hashing takes time
    // salt rounds - 10
    const hashedPassword = await bcrypt.hash(password,10)

    // If new user then add their details to DB
    const user = await User.create({
        name,
        email,
        password:hashedPassword
    })
    console.log(user);

    // Find id of the created user from DB
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    
    if(!createdUser)
    {
        throw new ApiError(500,"User Registration Failed!")

    }

    return res.status(201).json({
        response : new ApiResponse(
            200,
            createdUser,
            "User Registered Successfully",
        )
    })
})

// Authenticate User(Login)
const authenticateUser = asyncHandler(async(req,res)=>{
    // de-structure email and password from req.body
    const {email,password} = req.body 

    if(!email || !password)
    {
        throw new ApiError(400,"Email and password is required")
    }

    // Check if the user exists in DB or not

    // NOTE _ "user" is obj reference of the instance of User model which
    // essentially a single document from the collection. 
    // This instance has its properties (e.g., user.name, user.email, user.password).
    const user = await User.findOne({
        $or:[{email}]
    })

    if(!user)
    {
        throw new ApiError(400,"Invalid email entered!")
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid)
    {
        throw new ApiError(401,"Unauthorized, Password is incorrect!")
    }

    // If both email and password is valid, generate Access and Refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save the refreshToken in the database
    user.refreshToken = refreshToken;
    await user.save();

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") // fiels - password, refreshToken are not sent to loggedInUser

    // making authentication tokens more secured
    const options = {
        httpOnly: true,
        secure: true
    }

    // send the tokens as cookie 
    return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(
            200,
            {
                user:loggedInUser,
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        ))
    

    // return the tokens to the client
    // res.status(200).json(
    //     new ApiResponse(
    //         200,
    //         "Authentication Successful",
    //         {
    //             accessToken: accessToken,
    //             refreshToken: refreshToken,
    //             user:{
    //                 id:user._id,
    //                 name:user.name,
    //                 email:user.email
    //             }
    //         }
    //     )
    // )
})

// Logout User
const logOutUser = asyncHandler(async(req,res)=>{
    // remove the refreshToken from cookie
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
        secure: true,
        sameSite: "Strict"
    }

    // clear cookie storing access and refresh tokens
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(
            200,
            {},
            "User logged out successfully"
        ))

})

export {registerUser,authenticateUser,logOutUser}

