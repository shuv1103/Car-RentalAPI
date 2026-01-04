import Razorpay from 'razorpay';

if(!process.env.RAZORPAY_TEST_KEY_ID || !process.env.RAZORPAY_TEST_KEY_SECRET) {
    throw new Error("Razorpay Key ID and Key Secret must be set in environment variables");
}

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_TEST_KEY_ID,
    key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
});

export default razorpayInstance;