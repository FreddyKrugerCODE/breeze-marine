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
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Mail, Phone, Anchor, FileText } from "lucide-react"

interface Booking {
  id: string
  customer: string
  email: string
  phone: string
  service: string
  date: string
  time: string
  status: string
  boatDetails: {
    make: string
    model: string
    year: string
    length: string
  }
  notes?: string
}

interface BookingDetailsDialogProps {
  booking: Booking
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingDetailsDialog({ booking, open, onOpenChange }: BookingDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>View details for booking {booking.id}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center">
            <div className="font-medium">Status</div>
            <Badge
              variant={
                booking.status === "confirmed"
                  ? "default"
                  : booking.status === "completed"
                    ? "outline"
                    : booking.status === "cancelled"
                      ? "destructive"
                      : "secondary"
              }
              className={
                booking.status === "confirmed" ? "bg-green-500" : booking.status === "completed" ? "bg-blue-500" : ""
              }
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right flex items-center justify-end">
              <Calendar className="h-4 w-4 mr-2" /> Date
            </Label>
            <div className="col-span-3">{booking.date}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right flex items-center justify-end">
              <Clock className="h-4 w-4 mr-2" /> Time
            </Label>
            <div className="col-span-3">{booking.time}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right flex items-center justify-end">
              <FileText className="h-4 w-4 mr-2" /> Service
            </Label>
            <div className="col-span-3">{booking.service}</div>
          </div>

          <div className="border-t pt-4 mt-2">
            <h4 className="font-medium mb-3">Customer Information</h4>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right flex items-center justify-end">
                <User className="h-4 w-4 mr-2" /> Name
              </Label>
              <div className="col-span-3">{booking.customer}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right flex items-center justify-end">
                <Mail className="h-4 w-4 mr-2" /> Email
              </Label>
              <div className="col-span-3">{booking.email}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right flex items-center justify-end">
                <Phone className="h-4 w-4 mr-2" /> Phone
              </Label>
              <div className="col-span-3">{booking.phone}</div>
            </div>
          </div>

          <div className="border-t pt-4 mt-2">
            <h4 className="font-medium mb-3">Boat Information</h4>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right flex items-center justify-end">
                <Anchor className="h-4 w-4 mr-2" /> Make
              </Label>
              <div className="col-span-3">{booking.boatDetails.make}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right flex items-center justify-end">Model</Label>
              <div className="col-span-3">{booking.boatDetails.model}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Year</Label>
              <div className="col-span-3">{booking.boatDetails.year}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Length</Label>
              <div className="col-span-3">{booking.boatDetails.length}</div>
            </div>
          </div>

          {booking.notes && (
            <div className="border-t pt-4 mt-2">
              <h4 className="font-medium mb-3">Notes</h4>
              <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">{booking.notes}</div>
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
