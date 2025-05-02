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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MoreHorizontal, Plus, Calendar, Truck, DollarSign } from "lucide-react"
import { TrailerRentalCalendar } from "@/components/admin/trailer-rental-calendar"

// Mock data for trailers
const trailers = [
  {
    id: "single-3000",
    type: "Single Axle",
    capacity: 3000,
    description: "Single axle trailer suitable for boats up to 18ft",
    dailyRate: 75,
    weekendRate: 150,
    weeklyRate: 375,
    available: true,
    activeRentals: 0,
    upcomingRentals: 2,
  },
  {
    id: "single-5000",
    type: "Single Axle",
    capacity: 5000,
    description: "Heavy duty single axle trailer suitable for boats up to 21ft",
    dailyRate: 95,
    weekendRate: 190,
    weeklyRate: 475,
    available: true,
    activeRentals: 1,
    upcomingRentals: 3,
  },
  {
    id: "tandem-7000",
    type: "Tandem Axle",
    capacity: 7000,
    description: "Tandem axle trailer suitable for boats up to 26ft",
    dailyRate: 125,
    weekendRate: 250,
    weeklyRate: 625,
    available: false,
    activeRentals: 1,
    upcomingRentals: 1,
  },
  {
    id: "tandem-10000",
    type: "Tandem Axle",
    capacity: 10000,
    description: "Heavy duty tandem axle trailer suitable for boats up to 30ft",
    dailyRate: 150,
    weekendRate: 300,
    weeklyRate: 750,
    available: true,
    activeRentals: 0,
    upcomingRentals: 2,
  },
]

// Mock data for trailer rentals
const trailerRentals = [
  {
    id: "TR-123456",
    trailerId: "single-3000",
    trailerType: "Single Axle (3000 lbs)",
    customer: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    startDate: "2023-05-15",
    endDate: "2023-05-17",
    status: "confirmed",
    totalPrice: 150,
  },
  {
    id: "TR-123457",
    trailerId: "single-5000",
    trailerType: "Single Axle (5000 lbs)",
    customer: "Emily Johnson",
    email: "emily@example.com",
    phone: "(555) 234-5678",
    startDate: "2023-05-16",
    endDate: "2023-05-23",
    status: "active",
    totalPrice: 475,
  },
  {
    id: "TR-123458",
    trailerId: "tandem-7000",
    trailerType: "Tandem Axle (7000 lbs)",
    customer: "Michael Brown",
    email: "michael@example.com",
    phone: "(555) 345-6789",
    startDate: "2023-05-14",
    endDate: "2023-05-16",
    status: "active",
    totalPrice: 250,
  },
  {
    id: "TR-123459",
    trailerId: "single-3000",
    trailerType: "Single Axle (3000 lbs)",
    customer: "Sarah Davis",
    email: "sarah@example.com",
    phone: "(555) 456-7890",
    startDate: "2023-05-20",
    endDate: "2023-05-22",
    status: "confirmed",
    totalPrice: 150,
  },
  {
    id: "TR-123460",
    trailerId: "tandem-10000",
    trailerType: "Tandem Axle (10000 lbs)",
    customer: "Robert Wilson",
    email: "robert@example.com",
    phone: "(555) 567-8901",
    startDate: "2023-05-25",
    endDate: "2023-06-01",
    status: "confirmed",
    totalPrice: 750,
  },
  {
    id: "TR-123461",
    trailerId: "single-5000",
    trailerType: "Single Axle (5000 lbs)",
    customer: "Jennifer Martinez",
    email: "jennifer@example.com",
    phone: "(555) 678-9012",
    startDate: "2023-05-18",
    endDate: "2023-05-20",
    status: "confirmed",
    totalPrice: 190,
  },
]

export default function TrailersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("inventory")

  // Filter trailer rentals based on search term
  const filteredRentals = trailerRentals.filter((rental) => {
    return (
      rental.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.trailerType.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Trailer Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Trailer
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trailers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trailers.length}</div>
            <p className="text-xs text-muted-foreground">
              {trailers.filter((t) => t.available).length} currently available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trailers.reduce((sum, trailer) => sum + trailer.activeRentals, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {trailerRentals.filter((r) => r.status === "active").length} trailers currently rented
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Rentals</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trailers.reduce((sum, trailer) => sum + trailer.upcomingRentals, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {trailerRentals.filter((r) => r.status === "confirmed").length} confirmed bookings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${trailerRentals.reduce((sum, rental) => sum + rental.totalPrice, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="rentals">Rentals</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Daily Rate</TableHead>
                  <TableHead>Weekend Rate</TableHead>
                  <TableHead>Weekly Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trailers.map((trailer) => (
                  <TableRow key={trailer.id}>
                    <TableCell className="font-medium">{trailer.id}</TableCell>
                    <TableCell>{trailer.type}</TableCell>
                    <TableCell>{trailer.capacity} lbs</TableCell>
                    <TableCell>${trailer.dailyRate}</TableCell>
                    <TableCell>${trailer.weekendRate}</TableCell>
                    <TableCell>${trailer.weeklyRate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={trailer.available ? "default" : "secondary"}
                        className={trailer.available ? "bg-green-500" : ""}
                      >
                        {trailer.available ? "Available" : "In Use"}
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
                          <DropdownMenuItem>Edit trailer</DropdownMenuItem>
                          <DropdownMenuItem>View rentals</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Change status</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete trailer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="rentals" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search rentals..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Rental
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rental ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Trailer</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRentals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No rentals found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell className="font-medium">{rental.id}</TableCell>
                      <TableCell>
                        <div>
                          <div>{rental.customer}</div>
                          <div className="text-sm text-muted-foreground">{rental.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{rental.trailerType}</TableCell>
                      <TableCell>{rental.startDate}</TableCell>
                      <TableCell>{rental.endDate}</TableCell>
                      <TableCell>${rental.totalPrice}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            rental.status === "active"
                              ? "default"
                              : rental.status === "confirmed"
                                ? "outline"
                                : "secondary"
                          }
                          className={rental.status === "active" ? "bg-green-500" : ""}
                        >
                          {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
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
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit rental</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Change status</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Cancel rental</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rental Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <TrailerRentalCalendar rentals={trailerRentals} trailers={trailers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
