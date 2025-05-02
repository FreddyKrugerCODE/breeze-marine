"use client"

import { useState, useEffect } from "react"
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
import { Search, MoreHorizontal, Plus, Filter, Download, Pencil, Trash, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BoatCard } from "@/components/admin/boat-card"
import { useToast } from "@/components/ui/use-toast"

interface Boat {
  id: string
  title: string
  price: number
  year: number
  length: string
  type?: string
  manufacturer?: string
  make: string
  model: string
  engine: string
  hours: number
  condition: string
  description: string
  features: string[]
  images: string[]
  status: "available" | "pending" | "sold"
  dateAdded?: string
  createdAt: string
}

export default function BoatsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [boats, setBoats] = useState<Boat[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        const response = await fetch("/api/boats")
        if (!response.ok) {
          throw new Error("Failed to fetch boats")
        }
        const data = await response.json()
        setBoats(data)
      } catch (error) {
        console.error("Error fetching boats:", error)
        toast({
          title: "Error",
          description: "Failed to load boats. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBoats()
  }, [toast])

  // Filter boats based on search term and status
  const filteredBoats = boats.filter((boat) => {
    const matchesSearch =
      boat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boat.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boat.model.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || boat.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Boats for Sale</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Boat
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search boats..."
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
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>

          <Tabs value={viewMode} onValueChange={setViewMode} className="w-[120px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid" className="px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </TabsTrigger>
              <TabsTrigger value="table" className="px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBoats.length === 0 ? (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No boats found.</p>
                </div>
              ) : (
                filteredBoats.map((boat) => <BoatCard key={boat.id} boat={boat} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Length</TableHead>
                    <TableHead>Engine Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBoats.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No boats found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBoats.map((boat) => (
                      <TableRow key={boat.id}>
                        <TableCell className="font-medium">{boat.title}</TableCell>
                        <TableCell>${boat.price.toLocaleString()}</TableCell>
                        <TableCell>{boat.year}</TableCell>
                        <TableCell>{boat.length}</TableCell>
                        <TableCell>{boat.hours}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              boat.status === "available"
                                ? "default"
                                : boat.status === "pending"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              boat.status === "available"
                                ? "bg-green-500"
                                : boat.status === "sold"
                                  ? "bg-gray-500 text-white"
                                  : ""
                            }
                          >
                            {boat.status.charAt(0).toUpperCase() + boat.status.slice(1)}
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
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" /> View details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" /> Edit listing
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Change status</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" /> Delete listing
                              </DropdownMenuItem>
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
        </Tabs>
      )}
    </div>
  )
}
