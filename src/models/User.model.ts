import mongoose, { Document, Mongoose, Schema } from "mongoose";

export interface Message extends Document{
    // _id?: String;
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
    content: {
        type: String,
        reuired: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
})



export interface User extends Document{
    userName: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: Boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}


export const UserSchema: Schema<User> = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,   
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, "please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is reqired"],
        unique: true,
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is reqired"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code Expiry is reqired"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
}) 

export const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema)) ; 
// models mean we expect database already exist model ha and jo created ha wo existing mil raha ha 