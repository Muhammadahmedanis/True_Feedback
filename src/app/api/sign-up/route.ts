import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod/v4";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { userName, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({ userName, isVerified: true });
        if(existingUserVerifiedByUsername){
            return Response.json(
                { success: false, message: "Username is alredy taken" },
                { status: 400 }
            )
        }

        const existingUserByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
            
            if(existingUserByEmail.isVerified){
                return Response.json({success: false, message: "User alredy exist with this name"} , {status: 400})
            }else{
                const hashPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }

        }else{
            const hashPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                userName,
                email,
                password: hashPassword,
                verifyCode, 
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                messages: [],
            })

            await newUser.save();
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email, userName, verifyCode);
        if(!emailResponse.success){
            return Response.json({success: false, message: emailResponse.message} , {status: 500})
        }else{
            return Response.json({success: true, message: "User registered successfully. Please verify your email"} , {status: 200})
        }

    } catch (error) {
        console.error("Error registering user", error);
        return Response.json( { success: false, message: "Error registering user" }, { status: 500 } )
    }
}