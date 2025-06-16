'use client'

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageSchema } from "@/schemas/messageSchema";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Textarea } from '@/components/ui/textarea';
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { toast } from "sonner";
import { User } from "@/models/User.model";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split('||')
}
const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function Page() {
  const params = useParams<{ userName: string }>();
  const userName = params.userName;
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(parseStringMessages(initialMessageString));

  const { data: session } = useSession();
  const user = session?.user as User;

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  }

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true);
    try {
      if (user?.userName !== userName) {
        toast.error("You cannot send message to yourself");
        const response = await axios.post<ApiResponse>('/api/send-message', {
          ...data, userName,
        });
        toast.success(response.data?.message);
      }
      toast.error("You cannot send msg to yourself");
      form.reset({ ...form.getValues(), content: '' })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message ?? "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  }

  const fetchSuggestedMessages = async () => {
    try {
      setIsSuggestLoading(true);
      const response = await axios.post('/api/suggest-messages');
      const messageString = response.data.message;
      setSuggestedMessages(parseStringMessages(messageString));
    } catch (error) {
      console.error("Error fetching message", error);
      toast.error("Failed to fetch suggested messages");
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{userName}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled className="cursor-pointer">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="cursor-pointer" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-6">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4 cursor-pointer"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {isSuggestLoading ? (
              <>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </>
            ) : suggestedMessages.length > 0 ? (
              suggestedMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 cursor-pointer"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            ) : (
              <p className="text-gray-500">No suggested messages yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  )
}
