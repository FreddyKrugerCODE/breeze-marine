"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
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
import { MoreHorizontal, Pencil, Eye, Trash } from "lucide-react"

interface Boat {
  id: string
  title: string
  price: number
  year: number
  length: string
  make: string
  model: string
  engine: string
  hours: number
  condition: string
  description: string
  features: string[]
  images: string[]
  status: "available" | "pending" | "sold"
}

interface BoatCardProps {
  boat: Boat
}

export function BoatCard({ boat }: BoatCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] bg-muted">
        <img
          src={boat.images[0] || "/placeholder.svg?height=300&width=400"}
          alt={boat.title}
          className="object-cover w-full h-full"
        />
        <Badge
          variant={boat.status === "available" ? "default" : boat.status === "pending" ? "secondary" : "outline"}
          className={
            boat.status === "available"
              ? "absolute top-2 right-2 bg-green-500"
              : boat.status === "sold"
                ? "absolute top-2 right-2 bg-gray-500 text-white"
                : "absolute top-2 right-2"
          }
        >
          {boat.status.charAt(0).toUpperCase() + boat.status.slice(1)}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{boat.title}</h3>
            <p className="text-sm text-muted-foreground">
              {boat.make} {boat.model}
            </p>
          </div>
          <div className="text-lg font-bold">${boat.price.toLocaleString()}</div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Year:</span>
            <span>{boat.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Length:</span>
            <span>{boat.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Engine:</span>
            <span className="truncate">{boat.engine}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Hours:</span>
            <span>{boat.hours}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" /> View Details
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Pencil className="h-4 w-4 mr-2" /> Edit listing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Change status</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash className="h-4 w-4 mr-2" /> Delete listing
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
