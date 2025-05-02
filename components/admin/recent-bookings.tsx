"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react"

// Mock data for recent bookings
const recentBookings = [
  {
    id: "B-123456",
    customer: "Michael Johnson",
    service: "Engine Maintenance",
    date: "2023-05-15",
    time: "10:00 AM",
    status: "confirmed",
  },
  {
    id: "B-123457",
    customer: "Sarah Williams",
    service: "Hull Repairs",
    date: "2023-05-16",
    time: "2:00 PM",
    status: "pending",
  },
  {
    id: "B-123458",
    customer: "David Brown",
    service: "Detailing",
    date: "2023-05-17",
    time: "9:00 AM",
    status: "confirmed",
  },
  {
    id: "B-123459",
    customer: "Jennifer Davis",
    service: "Diagnostics",
    date: "2023-05-18",
    time: "11:00 AM",
    status: "pending",
  },
]

export function RecentBookings() {
  return (
    <div className="space-y-4">
      {recentBookings.map((booking) => (
        <div key={booking.id} className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {booking.customer
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{booking.customer}</p>
              <p className="text-sm text-muted-foreground">{booking.service}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={booking.status === "confirmed" ? "default" : "outline"}
              className={booking.status === "confirmed" ? "bg-green-500" : ""}
            >
              {booking.status === "confirmed" ? "Confirmed" : "Pending"}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm booking
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel booking
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
