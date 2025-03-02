import { Queue } from "bullmq";
import Redis from "ioredis";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const redis = new Redis()

const waitListQueue = new Queue("carWaitList", {
    connection:{
        host: "localhost",
        port: 6379
    },
});

// add user to waitlist
const addToWaitList = asyncHandler(async(req,res)=>{
    
});

export {waitListQueue}