import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BoatSpecs {
  length: string
  year: number
  engine: string
  hours: number
}

interface BoatCardProps {
  title: string
  price: number
  imageUrl: string
  specs: BoatSpecs
  link: string
}

export default function BoatCard({ title, price, imageUrl, specs, link }: BoatCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardContent className="pt-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-lg font-bold text-cyan-600">${price.toLocaleString()}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-semibold">Length:</span> {specs.length}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">Year:</span> {specs.year}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">Engine:</span> {specs.engine}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">Hours:</span> {specs.hours}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={link}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
