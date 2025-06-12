import { z } from "zod";

export const accpetMessageSchema = z.object({
    isAcceptingMessage: z.boolean() 
})