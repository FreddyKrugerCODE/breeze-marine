"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ship, Anchor, Ruler, Calendar, DollarSign, Check, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Mock boat data - in a real app, this would come from your API
const mockBoat = {
  id: "boat-1",
  name: "Sea Ray 250 SDX",
  price: 89500,
  year: 2022,
  length: 25,
  type: "Bowrider",
  manufacturer: "Sea Ray",
  description:
    "Luxury bowrider with premium features and excellent performance. Perfect for day cruising and water sports.",
  longDescription: `
    The Sea Ray 250 SDX is the epitome of luxury and performance in a bowrider. This vessel combines elegant styling with practical features to create the perfect day boat for families and entertaining.
    
    The spacious bow seating area comfortably accommodates passengers, while the cockpit offers a versatile layout with a convertible aft bench. The helm station is equipped with state-of-the-art electronics and controls for easy operation.
    
    Powered by a reliable Mercury engine, this boat delivers impressive performance on the water, with smooth handling and responsive controls. The deep-V hull design ensures a comfortable ride even in choppy conditions.
    
    Additional features include a premium sound system, built-in cooler, freshwater sink, and a spacious head compartment. The swim platform with integrated ladder makes water access easy and safe.
    
    This particular model is in excellent condition with low hours and has been meticulously maintained by its previous owner.
  `,
  features: [
    "GPS Navigation",
    "Stereo System",
    "Swim Platform",
    "Bathroom",
    "Bimini Top",
    "Cockpit Table",
    "Fresh Water System",
    "Shower",
    "Trim Tabs",
    "Snap-in Carpet",
  ],
  specifications: {
    engineType: "Mercury 350 HP",
    fuelType: "Gasoline",
    fuelCapacity: "65 gallons",
    maxSpeed: "45 mph",
    weight: "5,400 lbs",
    beam: "8.5 feet",
    draft: "3.1 feet",
    hullMaterial: "Fiberglass",
    seatingCapacity: "12 persons",
    sleepingCapacity: "0 persons",
  },
  imageUrl: "/placeholder.svg?height=400&width=800",
  additionalImages: [
    "/placeholder.svg?height=200&width=300&text=Image+1",
    "/placeholder.svg?height=200&width=300&text=Image+2",
    "/placeholder.svg?height=200&width=300&text=Image+3",
    "/placeholder.svg?height=200&width=300&text=Image+4",
  ],
  status: "available",
}

export default function BoatDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [boat, setBoat] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState("")

  useEffect(() => {
    // In a real app, fetch the boat data from your API
    const fetchBoat = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setBoat(mockBoat)
        setSelectedImage(mockBoat.imageUrl)
      } catch (error) {
        console.error("Error fetching boat:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load boat details. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBoat()
  }, [params.id])

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
        <span className="ml-2">Loading boat details...</span>
      </div>
    )
  }

  if (!boat) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-2xl font-bold">Boat not found</h2>
        <p className="text-muted-foreground mt-2">The boat you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="mt-4">
          <Link href="/boats">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Boats
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/boats">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Boats
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <div className="relative">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt={boat.name}
                className="w-full h-[400px] object-cover rounded-lg"
              />
              {boat.status !== "available" && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                  <Badge variant="destructive" className="text-lg uppercase px-4 py-2">
                    {boat.status}
                  </Badge>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {boat.additionalImages.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`${boat.name} - Image ${index + 1}`}
                  className={`h-20 w-full object-cover rounded-md cursor-pointer transition-all ${
                    selectedImage === image ? "ring-2 ring-cyan-500" : "hover:opacity-80"
                  }`}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          </div>

          <Tabs defaultValue="description" className="mt-8">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="whitespace-pre-line">{boat.longDescription}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specifications" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(boat.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b pb-2">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                        <span>{value as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {boat.features.map((feature: string) => (
                      <div key={feature} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-2">{boat.name}</h1>
              <div className="flex items-center text-3xl font-bold text-cyan-600 mb-4">
                <DollarSign className="h-6 w-6" />
                {boat.price.toLocaleString()}
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-medium">{boat.year}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Ruler className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Length</p>
                    <p className="font-medium">{boat.length} feet</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Ship className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{boat.type}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Anchor className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Manufacturer</p>
                    <p className="font-medium">{boat.manufacturer}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {boat.status === "available" ? (
                <div className="space-y-3">
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/boats/${boat.id}/checkout`}>Purchase Now</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact?subject=Inquiry about boat">Contact Us</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center p-3 bg-muted rounded-md">
                  <p className="font-medium">This boat is currently {boat.status}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please check our other available boats or contact us for similar options.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
