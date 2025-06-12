import { z } from "zod";

export const userNameValidation = z
   .string()
   .min(2, "Username must be atleast 2 characters")
   .max(20, "Username must be no more than 20 characters")
   .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

export const signupSchema = z.object({
    userName: userNameValidation,
    email: z.string().email({message: "invalid email address"}),
    password: z.string().min(6, {message: "Password atleast 6 characters"})
})   

