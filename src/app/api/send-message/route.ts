import dbConnect from "@/lib/dbConnect";
import { Message, UserModel } from "@/models/User.model";

export async function POST(request: Request) {
    await dbConnect();
    
    const { userName, content } = await request.json();
    try {
        const user = await UserModel.findOne({userName});
        if(!user){
            return Response.json( {success: false, message: "User not found"}, {status: 404} );
        }
        if(!user.isAcceptingMessage){
            return Response.json( {success: false, message: "User is not accepting the messages"}, {status: 403} );
        }

        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json( {success: 200, message: "Message sent successfully"}, {status: 200} );

    } catch (error) {
        console.error('Error adding messages', error);
        return Response.json( {success: false, message: "Internal server error"}, {status: 500} );
    }
}