import { createRazorpayOrder, verifyPayment } from "../services/payment.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

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