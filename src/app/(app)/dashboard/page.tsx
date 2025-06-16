'use client'

import MessageCard from "@/components/messageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/User.model";
import { accpetMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { use, useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Dashboard() {
  const[messages, setMessages] = useState<Message[]>([]);
  const[isLoading, setIsloading] = useState(false);
  const[isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messagesId: string) => {
    setMessages(messages.filter((message) => message._id !== messagesId))
  }

  const {data: session} = useSession();
  const form = useForm({
    resolver: zodResolver(accpetMessageSchema),
    defaultValues: {
      isAcceptingMessage: false,
    }
  })

  const { register, watch, setValue } = form

  const acceptMessage = watch('isAcceptingMessage')
  const fetchAcceptMessage = useCallback(async () => {
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/accept-message');
        setValue('isAcceptingMessage', response.data.isAcceptingMessage ?? false);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast.error(axiosError.response?.data?.message || "Failed fetch message setting")
      } finally{
        setIsSwitchLoading(false);
      }
  }, [setValue])

  const fetchMessages = useCallback( async(refresh: boolean = false) => {
    setIsloading(false);
    setIsSwitchLoading(false);

    try {
      const response = await axios.get<ApiResponse>('/api/get-message');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success('Showing latest messages');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data?.message || "Failed fetch message setting");
    } finally{
      setIsloading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsloading, setMessages])
  
  useEffect(() => {
    if(!session || !session.user) return
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  const handleSwitch = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-message', {
        acceptMessage: !acceptMessage,
      });
      setValue('isAcceptingMessage', !acceptMessage);
      toast.success(response?.data?.message);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data?.message || "Failed fetch message setting");
    }
  }

  const user = session?.user as User
  
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${user?.userName}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL has been copied to clipboard.");
  }

  if (!session || !session?.user) {
    return <div>Please login</div>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2 bg-gray-100 rounded-lg"
          />
          <Button className="cursor-pointer" onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
        className="cursor-pointer"
          {...register('isAcceptingMessage')}
          checked={acceptMessage}
          onCheckedChange={handleSwitch}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4 cursor-pointer"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4 " />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}
