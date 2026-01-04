import mongoose,{Mongoose, Schema} from "mongoose"
import { nanoid } from "nanoid";

const carSchema = new mongoose.Schema({
    carId:{
        type:String,
        default: () => nanoid(4),
        unique: true
    },
    manufacturer:{
        type: String,
        required: true,
        trim: true
    },
    model:{
        type: String,
        required: true,
        trim: true
    },
    year:{
        type: String,
        required:true,
        min: 1886, // before then cars not present
        max: new Date().getFullYear() //current date  
    },
    pricePerDay:{
        type: Number,
        required: true,
        min: 0 // ensures price >= 0 (can't be negative) 
    },
    isAvailability:{
        type:Boolean,
        required:true,
        default: true // by default keep car available until specified explicitly
    },
    count:{
        type: Number,
        required: true,
        min: 0 // ensures count >= 0 (can't be negative)
    },
    rentalHistory: [
        {
            email: {
                type: String,
                // type: mongoose.Schema.Types.ObjectId, // Reference to the User model
                // ref: "User", // Establish the relationship
                required: true
            },
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date,
                required: true
            },
            totalPrice: {
                type: Number,
                required: true
            },
            payment: {
                orderId: {
                  type: String,
                  required: true
                },
          
                paymentId: {
                  type: String,
                  default: null
                },
          
                status: {
                  type: String,
                  enum: ["PENDING", "PAID", "FAILED", "EXPIRED"],
                  default: "PENDING"
                },
          
                failureReason: {
                  type: String,
                  default: null
                }
            },
          
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    returnImages: {
        front: { 
            type: String // cloudinary image url
        },
        back: { 
            type: String // cloudinary image url
        },
        left: { 
            type: String // cloudinary image url
        },
        right: { 
            type: String // cloudinary image url
        }
    }
    
},{
    timestamps:true
})

export const Car = mongoose.model('Car', carSchema)