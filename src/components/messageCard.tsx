'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/models/User.model"
import axios from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { toast } from "sonner"
import dayjs from 'dayjs';

type MessageCardProp = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProp) {
    const handleDeleteConfirm = async() => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
        toast.success(response.data.message);
        onMessageDelete(message.id);
    }

  return (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
            <CardTitle>{message?.content}</CardTitle>
                <AlertDialog>
                <AlertDialogTrigger>
                    <Button className="cursor-pointer" variant="destructive"> <X /> </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="cursor-pointer" onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </div>
                <div className="text-sm">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
        </CardHeader>
        {/* <CardContent>{message?.userName}</CardContent> */}
    </Card>
  )
}
