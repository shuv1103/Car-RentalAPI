import { Queue } from "bullmq";
import Redis from "ioredis";
import { User } from "../models/user.model.js";
import { Car } from "../models/car.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const redis = new Redis(); // Creating a redis connection

// create a bullmq queue to process waitlist
const waitListQueue = new Queue("carWaitList", {
    connection:{
        host: "localhost",
        port: 6379
    },
});

// add user to waitlist when car is unavailable
// redis ZSET (FIFO based on timestamp)
const addToWaitList = asyncHandler(async(req,res)=>{
    const {userId, carId} = req.body;

    // required fields validation check
    if(!userId || !carId)
    {
        throw new ApiError(400,"UserID and CarID are required");
    }

    // check user exists in DB
    const user = await User.findById(userId);
    if(!user)
    {
        throw new ApiError(404,"User not found!");
    }

    // check car exists in DB
    const car = await Car.findById(carId);
    if(!car)
    {
        throw new ApiError(404,"Car not found!");
    }

    // creating a unique key for waitlist for specific car
    const waitlistkey = `waitlist:${carId}`;
    
    // check if user already in waitlist
    const isUserInQueue = await redis.zscore(waitlistkey, userId);
    if(isUserInQueue !== null)
    {
        throw new ApiError(409,`User ${userId}  already in waitlist for car ${carId}`);
    }

    // add userId, current timestamp(milliseconds), waitlistkey of the user 
    await redis.zadd(waitlistkey, Date.now(), userId);

    // add a bullmq job to process the waitlist
    await waitListQueue.add("WaitListUsers", { carId, userId, addedAt: Date.now() }, {
        attempts: 3, 
        backoff: {
            type: 'exponential',
            delay: 5000 // retry after 5 seconds
        },
        removeOnComplete: true, // auto-remove job after completion
        removeOnFail: true // auto-remove job if it fails
    });

    // return response
    return res.status(200).json(
        new ApiResponse(
            200,
            `User ${userId} added to waitlist for car ${carId}`
        )
    )
});

export {waitListQueue, addToWaitList}