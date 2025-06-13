import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signupSchema";

// querySchema is to check this and that object
const UsernameQuerySchema = z.object({
    userName: userNameValidation,
})

export async function GET(request: Request){ 
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            userName: searchParams.get("userName")
        }
        // validate with xod
        const result = UsernameQuerySchema.safeParse(queryParam);
        // console.log(result);

        if(!result.success){
            const userNameError = result.error.format().userName?._errors || [];
            return Response.json( {success: false, message: userNameError.length > 0 ? userNameError.join(', ') : 'Invalid query parameters'}, {status: 400} )
        } 
            
        const { userName } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ userName, isVerified: true});
        if(existingVerifiedUser){
            return Response.json( {success: false, message: "userName already taken"}, {status: 500} );
        }
        return Response.json( {success: true, message: "userName is available"}, {status: 200} );

    } catch (error) {
        console.error("Error checking userName", error);
        return Response.json( {success: false, message: "Error checking userName"}, {status: 500} )
    }
}