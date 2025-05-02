import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wrench, Anchor, Paintbrush, Snowflake, Search } from "lucide-react"
import { sql } from "@/lib/db"

export const metadata: Metadata = {
  title: "Services | Breeze Marine",
  description: "Professional boat maintenance and repair services",
}

// Service icons mapping
const serviceIcons: Record<string, React.ReactNode> = {
  "Engine Maintenance": <Wrench className="h-6 w-6" />,
  "Hull Repairs": <Anchor className="h-6 w-6" />,
  Detailing: <Paintbrush className="h-6 w-6" />,
  Winterization: <Snowflake className="h-6 w-6" />,
  Diagnostics: <Search className="h-6 w-6" />,
}

async function getServices() {
  try {
    const services = await sql`
      SELECT * FROM "Service" WHERE active = true ORDER BY name
    `
    return services
  } catch (error) {
    console.error("Failed to fetch services:", error)
    return []
  }
}

export default async function ServicesPage() {
  const services = await getServices()

  // Group services by category
  const servicesByCategory = services.reduce((acc: Record<string, any[]>, service: any) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {})

  const categories = Object.keys(servicesByCategory)

  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional boat maintenance and repair services to keep your vessel in top condition
        </p>
      </div>

      <Tabs defaultValue={categories[0] || "Maintenance"} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-sm md:text-base">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {servicesByCategory[category].map((service) => (
                <Card key={service.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-3 text-primary">
                        {serviceIcons[service.name] || <Wrench className="h-6 w-6" />}
                      </div>
                      <div>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription className="mt-1.5">{service.duration} minutes</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p>{service.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="text-lg font-semibold">{service.price ? `$${service.price}` : "Request Quote"}</div>
                    <Button asChild>
                      <Link href="/services/book">Book Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a Custom Service?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Don't see what you're looking for? Contact us for custom service requests and quotes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/video-call">Schedule Video Consultation</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
