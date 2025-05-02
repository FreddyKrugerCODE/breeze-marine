"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createTrailerRentalPaymentIntent } from "@/lib/stripe-service"
import { PaymentProvider } from "@/components/payment/payment-provider"
import { PaymentForm } from "@/components/payment/payment-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Loader2, Truck, CalendarIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format, addDays, differenceInDays } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

// Mock trailer data - in a real app, this would come from your API
const mockTrailer = {
  id: "trailer-1",
  name: "Boat Trailer - Large",
  dailyRate: 75,
  description: "Heavy-duty trailer suitable for boats up to 26 feet",
  imageUrl: "/placeholder.svg?height=300&width=600",
}

export default function TrailerRentalPage() {
  const params = useParams()
  const router = useRouter()
  const [trailer, setTrailer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [clientSecret, setClientSecret] = useState("")
  const [customerEmail, setCustomerEmail] = useState("customer@example.com") // In a real app, get this from user input or auth

  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date | undefined
  }>({
    from: new Date(),
    to: addDays(new Date(), 3),
  })

  const [totalDays, setTotalDays] = useState(3)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    // In a real app, fetch the trailer data from your API
    const fetchTrailer = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setTrailer(mockTrailer)
      } catch (error) {
        console.error("Error fetching trailer:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load trailer details. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTrailer()
  }, [params.id])

  useEffect(() => {
    // Calculate total days and amount when date range changes
    if (dateRange.from && dateRange.to && trailer) {
      const days = differenceInDays(dateRange.to, dateRange.from) + 1
      setTotalDays(days)
      setTotalAmount(days * trailer.dailyRate)
    }
  }, [dateRange, trailer])

  useEffect(() => {
    // Create a payment intent when trailer data is loaded and dates are selected
    const initializePayment = async () => {
      if (trailer && dateRange.from && dateRange.to) {
        try {
          const { clientSecret } = await createTrailerRentalPaymentIntent(
            trailer.id,
            format(dateRange.from, "yyyy-MM-dd"),
            format(dateRange.to, "yyyy-MM-dd"),
            totalAmount,
            customerEmail,
          )
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
  }, [trailer, dateRange, totalAmount, customerEmail])

  const handlePaymentSuccess = (paymentIntentId: string) => {
    // In a real app, update your database with the rental info
    toast({
      title: "Rental Successful!",
      description: "Your trailer rental has been confirmed.",
    })

    // Redirect to confirmation page
    router.push(`/trailers/${params.id}/confirmation?payment_intent=${paymentIntentId}`)
  }

  const handleCancel = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
        <span className="ml-2">Loading trailer details...</span>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Complete Your Trailer Rental</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Trailer Details
              </CardTitle>
              <CardDescription>Review your trailer rental</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <img
                  src={trailer.imageUrl || "/placeholder.svg"}
                  alt={trailer.name}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h3 className="text-xl font-semibold">{trailer.name}</h3>
                <p className="text-muted-foreground">{trailer.description}</p>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rental Period</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={(range) => {
                          if (range?.from && range?.to) {
                            setDateRange(range as { from: Date; to: Date })
                          }
                        }}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-medium">Daily Rate:</span>
                  <span>${trailer.dailyRate}/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Number of Days:</span>
                  <span>{totalDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>${(trailer.dailyRate * totalDays).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tax:</span>
                  <span>${(trailer.dailyRate * totalDays * 0.07).toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">${totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {clientSecret ? (
            <PaymentProvider clientSecret={clientSecret}>
              <PaymentForm amount={totalAmount} onSuccess={handlePaymentSuccess} onCancel={handleCancel} />
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
