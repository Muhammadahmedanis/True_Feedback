import { z } from "zod";

export const MessageSchema = z.object({
    content: z
    .string()
    .min(10, {message: "Content must be at least of 10 characters"})
    .max(300, {message: "Content must be no longer than 300 characters"})
})

// NextJS is a edge time frame work jase user ki request aati ha tab hi cheezain execute hoti hain spaecially in Netxjs ma jitna bhi function hota hain ye no time hi run hota hain, NextJS ma cheezain all time running nhi hoti so databsee all time connected nhi hota jase request jati wase hi connected hota ha so , when ever i call api first i check database is connected ? if no so connected first then ... else not connected 