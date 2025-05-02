"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createBoatPaymentIntent } from "@/lib/stripe-service"
import { PaymentProvider } from "@/components/payment/payment-provider"
import { PaymentForm } from "@/components/payment/payment-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Ship } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Mock boat data - in a real app, this would come from your API
const mockBoat = {
  id: "boat-1",
  name: "Sea Ray 250 SDX",
  year: 2022,
  price: 89500,
  description: "Luxury bowrider with premium features",
  imageUrl: "/placeholder.svg?height=300&width=600",
}

export default function BoatCheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const [boat, setBoat] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [clientSecret, setClientSecret] = useState("")
  const [customerEmail, setCustomerEmail] = useState("customer@example.com") // In a real app, get this from user input or auth

  useEffect(() => {
    // In a real app, fetch the boat data from your API
    const fetchBoat = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setBoat(mockBoat)
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

  useEffect(() => {
    // Create a payment intent when boat data is loaded
    const initializePayment = async () => {
      if (boat) {
        try {
          const { clientSecret } = await createBoatPaymentIntent(boat.id, boat.price, customerEmail)
          setClientSecret(clientSecret)
        } catch (error) {
          console.error("Error creating payment intent:", error)
          toast({
            variant: "destructive",
            title: "Payment Error",
            description: "Failed to initialize payment. Please try again.",
          })
        }
      }
    }

    initializePayment()
  }, [boat, customerEmail])

  const handlePaymentSuccess = (paymentIntentId: string) => {
    // In a real app, update your database with the payment info
    toast({
      title: "Purchase Successful!",
      description: "Your boat purchase has been completed successfully.",
    })

    // Redirect to confirmation page
    router.push(`/boats/${params.id}/confirmation?payment_intent=${paymentIntentId}`)
  }

  const handleCancel = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
        <span className="ml-2">Loading boat details...</span>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Complete Your Purchase</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ship className="mr-2 h-5 w-5" />
                Boat Details
              </CardTitle>
              <CardDescription>Review your boat purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <img
                  src={boat.imageUrl || "/placeholder.svg"}
                  alt={boat.name}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h3 className="text-xl font-semibold">{boat.name}</h3>
                <p className="text-muted-foreground">
                  {boat.year} • {boat.description}
                </p>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span className="font-bold">${boat.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tax:</span>
                  <span>${(boat.price * 0.07).toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">${(boat.price * 1.07).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {clientSecret ? (
            <PaymentProvider clientSecret={clientSecret}>
              <PaymentForm amount={boat.price * 1.07} onSuccess={handlePaymentSuccess} onCancel={handleCancel} />
            </PaymentProvider>
          ) : (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
              <span className="ml-2">Initializing payment...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
