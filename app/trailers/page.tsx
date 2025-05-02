import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrailerAvailabilityCalendar } from "@/components/trailers/trailer-availability-calendar"
import { Truck, Calendar, Info } from "lucide-react"
import { sql } from "@/lib/db"

export const metadata: Metadata = {
  title: "Trailer Rentals | Breeze Marine",
  description: "Rent a boat trailer for your transportation needs",
}

async function getTrailers() {
  try {
    const trailers = await sql`
      SELECT * FROM "Trailer" WHERE active = true ORDER BY capacity
    `
    return trailers
  } catch (error) {
    console.error("Failed to fetch trailers:", error)
    return []
  }
}

export default async function TrailersPage() {
  const trailers = await getTrailers()

  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Trailer Rentals</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Quality boat trailers available for daily, weekend, and weekly rentals
        </p>
      </div>

      <Tabs defaultValue="trailers" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="trailers" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Available Trailers</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Availability Calendar</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trailers" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {trailers.map((trailer: any) => (
              <Card key={trailer.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{trailer.type}</CardTitle>
                  <CardDescription>{trailer.capacity} lbs capacity</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>{trailer.description}</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Daily Rate:</span>
                      <span className="font-medium">${trailer.dailyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Weekend Rate:</span>
                      <span className="font-medium">${trailer.weekendRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Weekly Rate:</span>
                      <span className="font-medium">${trailer.weeklyRate}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/trailers/${trailer.id}/rent`}>Rent This Trailer</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Trailer Availability</CardTitle>
              <CardDescription>Check which trailers are available on your desired dates</CardDescription>
            </CardHeader>
            <CardContent>
              <TrailerAvailabilityCalendar trailers={trailers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-16 bg-muted/50 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="rounded-full bg-primary/10 p-4 text-primary">
            <Info className="h-8 w-8" />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-xl font-bold mb-2">Rental Requirements</h2>
            <p className="text-muted-foreground">
              All trailer rentals require a valid driver's license, proof of insurance, and a vehicle with appropriate
              towing capacity. A security deposit is required at the time of rental.
            </p>
          </div>
          <Button asChild size="lg" className="whitespace-nowrap">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
