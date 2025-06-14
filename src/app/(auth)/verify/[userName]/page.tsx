'use client'

import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export default function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{userName: string}>();
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                userName: params.userName,
                code: data.code
            })
            toast.success(response.data.message);
            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMsg = axiosError.response?.data.message;
            toast.error(errorMsg);
        }     
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
            <h1 className='text-2xl font-extrabold tracking-tight lg:text-4xl mb-6'>Verify your Account</h1>
            <p className='mb-4'>
                Verification Code sent to your email
            </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                            <Input placeholder="code" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    </div>
  )
}
