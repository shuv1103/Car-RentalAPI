import { createRazorpayOrder, verifyPayment } from "../services/payment.service.js";
import { Car } from "../models/car.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clientCommandMessageReg } from "bullmq";

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

const razorpayWebhookController = asyncHandler(async(req,res) => {
    const razorpaySignature = req.headers["x-razorpay-signature"];

    if(!razorpaySignature)
    {
        throw new ApiError(400, "Razorpay signature is required");
    }

    const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_TEST_KEY_SECRET)
                                    .update(JSON.stringify(req.body))
                                    .digest("hex");

    if(expectedSignature !== razorpaySignature)
    {
        throw new ApiError(400, "Invalid Razorpay signature");
    }

    const event = req.body.event;

    if(event === "payment.captured")
    {
        const payment = req.body.payload.payment.entity;
        const orderId = payment.order_id;
    

        // Find the rental entry by orderId
        const car = await Car.findOne({orderId});
        
        if(!car)
        {
            throw new ApiError(404, "Rental record not found");
        }

        const rental = car.rentalHistory.find(r => r.orderId === orderId && r.paymentStatus === "PENDING");

        // Idempotency check
        if(!rental)
        {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {},
                    "Payment already processed"   
                )
            );
        }

        // Finalize the rental booking
        rental.paymentStatus = "PAID";
        car.count = car.count - 1; // update car count after renting
        if(car.count <= 0)
        {
            car.isAvailability = false; // update car availability to false if count is 0
        }

        await car.save(); // save the updated car to the database

        console.log("Rental confirmed via webhook:", orderId);

    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Payment processed successfully"
        )
    );                                                   
});

export {generatePaymentOrder, verifyPaymentController, razorpayWebhookController}