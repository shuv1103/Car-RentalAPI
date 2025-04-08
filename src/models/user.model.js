import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"
import {nanoid} from "nanoid"
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    userId:{
        type:String,
        default: () => nanoid(4),
        unique:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    refreshToken:{
        type:String
    },
    role:{
        type:String,
        enum:['user','admin'],
    }
},{timestamp:true})

// userSchema.pre('save', function (next) {
//     if (!this.userId) {
//         this.userId = uuidv4(); // Generate a unique ID
//     }
//     next();
// });

userSchema.pre('save',async function(next){

    if(!this.isModified(this.password))
    {
        return next();
    }
    else
    {
        this.password = await bcrypt.hash(this.password,10);
        next();
    }
})

userSchema.methods.generateAccessToken = function()
{
    return jwt.sign(
        {
        _id:this._id,
        email:this.email,
        name:this.name,
        userId:this.userId
        },
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
        _id:this._id,
        },
        process.env.ACCESS_TOKEN_SECRET, // process.env is obj reference that is used to set/retrieve env variables
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}


export const User = mongoose.model('User',userSchema)