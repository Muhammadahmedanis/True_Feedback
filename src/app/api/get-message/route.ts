import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].ts/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if(!session || !session.user){
        return Response.json( {success: false, message: "Not Authenticated"}, {status: 401} )
    }
    console.log("get-message", user._id);
    const userId = new mongoose.Types.ObjectId(user._id);  // because id we get in string format 
    try {
        const user = await UserModel.aggregate([
            { $match: {id: userId} }, 
            { $unwind: '$messages' }, // unwind specially used convert array og muyliple object to multiple objects with same id [ {}, {} ] => {}{}
            { $sort: {'messages.createdAt': -1} },
            { $group: {_id: '$_id', messages: {$push: '$messages'}} } 
        ])

        if (!user || user.length === 0) {
            return Response.json( {success: false, message: "User not found"}, {status: 404} );
        }
         return Response.json( {success: true, messages: user[0].messages}, {status: 200} );

    } catch (error) {
        console.error("An unexpected error occured: ", error);
        return Response.json( {success: false, message: "Internal server error"}, {status: 500} );
    }
}