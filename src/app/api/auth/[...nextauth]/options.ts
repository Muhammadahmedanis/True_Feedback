import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email/Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<any> {
                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error("Email and password are required");
                }
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or: [ { email: credentials.identifier }, { userName: credentials.identifier }]
                    });

                    if (!user) {
                        throw new Error("No user found with this email or username");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before logging in");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(isPasswordCorrect){
                        return user;
                    } else{
                      throw new Error("Incorrect Password");
                    }

                } catch (err: any) {
                    throw new Error(err.message || "Something went wrong during authentication");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user}) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.userName = user.userName;
            }
            return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.userName = token.userName;
            }
          return session
        },
    },
    pages: {
        signIn: "/auth/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};
