"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, MoreHorizontal, Plus, Filter, Download } from "lucide-react"
import { BookingDetailsDialog } from "@/components/admin/booking-details-dialog"

// Mock data for bookings
const bookings = [
  {
    id: "B-123456",
    customer: "Michael Johnson",
    email: "michael@example.com",
    phone: "(555) 123-4567",
    service: "Engine Maintenance",
    date: "2023-05-15",
    time: "10:00 AM",
    status: "confirmed",
    boatDetails: {
      make: "Sea Ray",
      model: "270 Sundancer",
      year: "2018",
      length: "27 ft",
    },
    notes: "Customer requested a thorough inspection of the cooling system.",
  },
  {
    id: "B-123457",
    customer: "Sarah Williams",
    email: "sarah@example.com",
    phone: "(555) 234-5678",
    service: "Hull Repairs",
    date: "2023-05-16",
    time: "2:00 PM",
    status: "pending",
    boatDetails: {
      make: "Boston Whaler",
      model: "210 Montauk",
      year: "2020",
      length: "21 ft",
    },
    notes: "Minor damage on starboard side near waterline.",
  },
  {
    id: "B-123458",
    customer: "David Brown",
    email: "david@example.com",
    phone: "(555) 345-6789",
    service: "Detailing",
    date: "2023-05-17",
    time: "9:00 AM",
    status: "confirmed",
    boatDetails: {
      make: "Bayliner",
      model: "180 Element",
      year: "2016",
      length: "18 ft",
    },
    notes: "Full interior and exterior detailing requested.",
  },
  {
    id: "B-123459",
    customer: "Jennifer Davis",
    email: "jennifer@example.com",
    phone: "(555) 456-7890",
    service: "Diagnostics",
    date: "2023-05-18",
    time: "11:00 AM",
    status: "pending",
    boatDetails: {
      make: "Chaparral",
      model: "223 VRX",
      year: "2019",
      length: "22 ft",
    },
    notes: "Engine making unusual noise during acceleration.",
  },
  {
    id: "B-123460",
    customer: "Robert Wilson",
    email: "robert@example.com",
    phone: "(555) 567-8901",
    service: "Winterization",
    date: "2023-05-19",
    time: "1:00 PM",
    status: "confirmed",
    boatDetails: {
      make: "Monterey",
      model: "258SS",
      year: "2017",
      length: "25 ft",
    },
    notes: "Standard winterization package.",
  },
  {
    id: "B-123461",
    customer: "Lisa Martinez",
    email: "lisa@example.com",
    phone: "(555) 678-9012",
    service: "Electrical Systems",
    date: "2023-05-20",
    time: "3:00 PM",
    status: "cancelled",
    boatDetails: {
      make: "Regal",
      model: "2300 RX",
      year: "2021",
      length: "23 ft",
    },
    notes: "Navigation lights not working properly.",
  },
  {
    id: "B-123462",
    customer: "James Taylor",
    email: "james@example.com",
    phone: "(555) 789-0123",
    service: "Engine Maintenance",
    date: "2023-05-21",
    time: "10:00 AM",
    status: "completed",
    boatDetails: {
      make: "Sea Ray",
      model: "290 Sundancer",
      year: "2015",
      length: "29 ft",
    },
    notes: "Annual service and oil change.",
  },
]

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking)
    setIsDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Booking
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bookings..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{booking.customer}</div>
                      <div className="text-sm text-muted-foreground">{booking.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>
                    <div>
                      <div>{booking.date}</div>
                      <div className="text-sm text-muted-foreground">{booking.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
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
                        booking.status === "confirmed"
                          ? "bg-green-500"
                          : booking.status === "completed"
                            ? "bg-blue-500"
                            : ""
                      }
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(booking)}>View details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit booking</DropdownMenuItem>
                        <DropdownMenuItem>Change status</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Cancel booking</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedBooking && (
        <BookingDetailsDialog booking={selectedBooking} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      )}
    </div>
  )
}
