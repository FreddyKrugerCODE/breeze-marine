import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface BoatListingCardProps {
  boat: {
    id: string
    title: string
    make: string
    model: string
    year: number
    length: string
    price: number
    images?: string[]
    status?: string
  }
}

export function BoatListingCard({ boat }: BoatListingCardProps) {
  // Safely capitalize the first letter of status if it exists
  const capitalizeStatus = (status: string | undefined) => {
    if (!status) return ""
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <Link href={`/boats/${boat.id}`}>
      <div className="relative aspect-[4/3] bg-muted">
        <Image
          src={boat.images && boat.images.length > 0 ? boat.images[0] : "/placeholder.svg?height=300&width=400"}
          alt={boat.title}
          className="object-cover w-full h-full"
          width={400}
          height={300}
        />
        {boat.status === "available" && (
          <Badge variant="secondary" className="absolute top-2 right-2 bg-gray-500 text-white">
            {capitalizeStatus(boat.status)}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{boat.title}</h3>
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-muted-foreground">
            {boat.year} • {boat.length}
          </div>
          <div className="font-bold">{formatCurrency(boat.price)}</div>
        </div>
      </div>
    </Link>
  )
}
