import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Anchor, Calendar, Gauge } from "lucide-react"

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
  status: string
}

interface BoatListingCardProps {
  boat: Boat
}

export function BoatListingCard({ boat }: BoatListingCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[4/3] bg-muted">
        <img
          src={boat.images[0] || "/placeholder.svg?height=300&width=400"}
          alt={boat.title}
          className="object-cover w-full h-full"
        />
        {boat.status !== "available" && (
          <Badge variant="secondary" className="absolute top-2 right-2 bg-gray-500 text-white">
            {boat.status.charAt(0).toUpperCase() + boat.status.slice(1)}
          </Badge>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{boat.title}</h3>
            <p className="text-sm text-muted-foreground">
              {boat.make} {boat.model}
            </p>
          </div>
          <div className="text-lg font-bold">${boat.price.toLocaleString()}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{boat.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Anchor className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{boat.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{boat.hours} hrs</span>
          </div>
        </div>
        <p className="mt-3 text-sm line-clamp-2 text-muted-foreground">{boat.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/boats/${boat.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
