'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signupSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/apiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader, Loader2 } from 'lucide-react';

export default function Signup() {
  const[userName, setUsername] = useState('');
  const[userNameMessage, setUserNameMessage] = useState('');
  const[isCheckingUsername, setIsCheckingUsername] = useState(false);
  const[isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    const checkUserNameUnique = async () => {
      if (userName) {
        setIsCheckingUsername(true);
        setUserNameMessage('');
        try {
          const response = await axios.get(`/api/check-uni-uName?userName=${userName}`);
          setUserNameMessage(response.data.message);
          console.log(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUserNameMessage(axiosError.response?.data?.message ?? "Error checking userName");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }
    
    checkUserNameUnique();
  
  }, [userName])

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    console.log(data, "signup");
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast.success(response.data.message);
      router.replace(`/verify/${userName}`);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error, "Error in signup");
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMsg = axiosError.response?.data.message;
      toast.error(errorMsg);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign up to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="userName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} onChange={(e) => { 
                      field.onChange(e) 
                      debounced(e.target.value)
                    }} />
                  </FormControl>
                    { isCheckingUsername && <Loader2 className="animate-spin" /> }
                    <p className={`text-sm ${userNameMessage === 'userName is available' ? 'text-green-500' : 'text-red-500'}`}>{userNameMessage}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email" {...field}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Psssword</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="cursor-pointer" type="submit" disabled={isSubmitting}> {isSubmitting ? ( <Loader className="mr-2 h-4 w-4 animate-spin" />)  : ('Signup') } </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600  hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
