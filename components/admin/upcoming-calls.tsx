"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Video } from "lucide-react"

// Mock data for upcoming video calls
const upcomingCalls = [
  {
    id: "VC-123456",
    customer: "Robert Smith",
    purpose: "Boat Viewing",
    date: "2023-05-15",
    time: "11:30 AM",
  },
  {
    id: "VC-123457",
    customer: "Emily Johnson",
    purpose: "Service Consultation",
    date: "2023-05-16",
    time: "2:30 PM",
  },
  {
    id: "VC-123458",
    customer: "Thomas Wilson",
    purpose: "Technical Support",
    date: "2023-05-17",
    time: "10:30 AM",
  },
]

export function UpcomingCalls() {
  return (
    <div className="space-y-4">
      {upcomingCalls.map((call) => (
        <div key={call.id} className="flex items-start space-x-4">
          <Avatar className="h-9 w-9 mt-0.5">
            <AvatarFallback>
              {call.customer
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{call.customer}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {call.date}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{call.purpose}</p>
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-muted-foreground">{call.time}</p>
              <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                <Video className="h-3 w-3 mr-1" />
                Join Call
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
