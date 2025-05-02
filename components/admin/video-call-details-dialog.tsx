"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, User, Mail, Phone, Video, FileText } from "lucide-react"

interface VideoCall {
  id: string
  date: string
  time: string
  purpose: string
  status: string
  meetingLink?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  notes?: string
}

interface VideoCallDetailsDialogProps {
  call: VideoCall
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VideoCallDetailsDialog({ call, open, onOpenChange }: VideoCallDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Video Call Details</DialogTitle>
          <DialogDescription>View details for video call {call.id}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right flex items-center justify-end">
              <Calendar className="h-4 w-4 mr-2" /> Date
            </Label>
            <div className="col-span-3">{new Date(call.date).toLocaleDateString()}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right flex items-center justify-end">
              <Clock className="h-4 w-4 mr-2" /> Time
            </Label>
            <div className="col-span-3">{call.time}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right flex items-center justify-end">
              <User className="h-4 w-4 mr-2" /> Customer
            </Label>
            <div className="col-span-3">{call.customerName}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right flex items-center justify-end">
              <Mail className="h-4 w-4 mr-2" /> Email
            </Label>
            <div className="col-span-3">{call.customerEmail}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right flex items-center justify-end">
              <Phone className="h-4 w-4 mr-2" /> Phone
            </Label>
            <div className="col-span-3">{call.customerPhone}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right flex items-center justify-end">
              <FileText className="h-4 w-4 mr-2" /> Purpose
            </Label>
            <div className="col-span-3">{call.purpose}</div>
          </div>
          {call.meetingLink && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right flex items-center justify-end">
                <Video className="h-4 w-4 mr-2" /> Link
              </Label>
              <div className="col-span-3">
                <a
                  href={call.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {call.meetingLink}
                </a>
              </div>
            </div>
          )}
          {call.notes && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right flex items-center justify-end pt-2">
                <FileText className="h-4 w-4 mr-2" /> Notes
              </Label>
              <div className="col-span-3 whitespace-pre-wrap">{call.notes}</div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
