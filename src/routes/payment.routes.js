import { Router } from "express";
import { generatePaymentOrder, verifyPaymentController } from "../controllers/payment.controllers.js";

const paymentRouter = Router();

// Routes for Razorpay payment order
paymentRouter.route("/create-order").post(generatePaymentOrder);
paymentRouter.route("/verify-payment").post(verifyPaymentController);

export default paymentRouter