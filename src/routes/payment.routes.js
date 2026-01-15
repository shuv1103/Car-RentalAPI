import express from "express";
import { Router } from "express";
import { generatePaymentOrder, verifyPaymentController, razorpayWebhookController } from "../controllers/payment.controllers.js";

const paymentRouter = Router();

// Routes for Razorpay payment order
paymentRouter.route("/create-order").post(generatePaymentOrder);
paymentRouter.route("/verify-payment").post(verifyPaymentController); // payment verification from frontend(user-side)
// Razorpay webhook for payment confirmation
paymentRouter.post("/webhook", express.raw({type: "application/json"}), razorpayWebhookController);

export default paymentRouter;