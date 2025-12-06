import razorpayInstance from '../../config/razorpay.js';
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import crypto from "crypto"

// creates an order and sends it to frontend
const createRazorpayOrder = async (amount, receiptId) => {
    try{
        const orderOptions = {
            amount: amount * 100,
            currency: "INR",
            receipt: receiptId
        };

        const order = await razorpayInstance.orders.create(orderOptions);
        return order;
    }catch(error){
        console.log("Razorpay Order Error", error);
        throw new ApiError(500, "Failed to create Razorpay Order");
    }
}

// frontend sends payment_id, order_id and signature after  payment success to backend
const verifyPayment = asyncHandler(async(req,res)=>{
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;

    const generated_signature = crypto
        .createHmac("sha256",process.env.RAZORPAY_TEST_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    if(generated_signature === razorpay_signature)
    {
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    success: true,
                    message: "Payment verified!"
                },
            )
        );
    }
    else
    {
        throw new ApiError(400, {success: false, message: "Payment verification failed!"});
    }


    

});


export { createRazorpayOrder }

