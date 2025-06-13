import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";
import { success } from "zod/v4";

export async function POST(request: Request){
    await dbConnect();

    try {
        const { userName, code } = await request.json();
        const decodedUsername = decodeURIComponent(userName);
        const user = await UserModel.findOne({ userName: decodedUsername });
        if(!user){
            return Response.json( {success: false, message: "user not found"}, {status: 400} )
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNodeExpired = new Date(user.verifyCodeExpiry) > new Date();
        if(isCodeValid  && isCodeNodeExpired ){
            user.isVerified = true;
            await user.save();
            return Response.json( {success: true, message: "Account verified successfully"}, {status: 200} );
        } else if(!isCodeNodeExpired) {
            return Response.json( {success: false, message: "Verification code has expired"}, {status: 400} )
        } else {
            return Response.json( {success: false, message: "Incorrect Verification code"}, {status: 400} )
        }

    } catch (error) {
        console.error("Error verifying user", error)
        return Response.json( {success: false, message: "Error verifying user"}, {status: 500} )
    }
}