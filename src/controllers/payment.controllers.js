import { createRazorpayOrder, verifyPayment } from "../services/payment.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearScreenDown } from "readline";

const generatePaymentOrder = asyncHandler(async(req,res) => {
    const {amount, receiptId} = req.body;

    if([amount,receiptId].some( value => value == null || value == ''))
    {
        throw new ApiError(400, "Amount & receiptId required");
    }  

    const order = await createRazorpayOrder(amount, receiptId);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt,
                status: order.status
            },
            "Razorpay payment order created successfully."
        )
    )
});

const verifyPaymentController = asyncHandler(async(req,res) => {
    return verifyPayment(req,res);
});

export {generatePaymentOrder, verifyPaymentController}