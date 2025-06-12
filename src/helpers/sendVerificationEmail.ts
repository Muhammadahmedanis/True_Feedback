import { resend } from "@/lib/resend";
import EmailTemplate from "../../email/EmailTemplate";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(email: string, userName: string, verifyCode: string): Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'True Feedback | Verification code',
            react: EmailTemplate({ userName, otp: verifyCode }),
        });
        return {
            success: true,
            message: "Verification email send successfulyy"
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to send verification email"
        }
    }
}

// if (error) {
//   return Response.json({ error }, { status: 500 });
// }

// try {
    //     return {
        //         success: true,
        //         message: "Verification email send successfulyy"
        //     }
        // } catch (error) {
//     console.error("Error sending verification email", error);
//     return {
//         success: false,
//         message: "Failed to send verification email"
//     }
// }