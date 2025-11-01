import razorpayInstance from '../../config/razorpay.js';
import { ApiError } from "../utils/ApiError.js"

const createRazorpayOrder = async (amount, receiptId) => {
    try{
        const orderOptions = {
            amount: amount,
            currency: "INR",
            receipt: receiptId
        };

        const order = await razorpayInstance.orders.create(orderOptions);
        return order;
    }catch(error){
        console.log("Razorpay Order Error", error);
        throw new ApiError(500, "Failed to create Razorpay Order")
    }
}

export { createRazorpayOrder }

