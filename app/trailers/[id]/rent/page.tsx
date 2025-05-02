"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PaymentProvider } from "@/components/payment/payment-provider"
import { PaymentForm } from "@/components/payment/payment-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Loader2, Truck, CalendarIcon, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format, addDays, differenceInDays } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date | undefined
  }>({
    from: new Date(),
    to: addDays(new Date(), 3),
  })

  const [totalDays, setTotalDays] = useState(3)
  const [totalAmount, setTotalAmount] = useState(225) // 3 days * $75

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

  const initializePayment = async () => {
    if (!trailer) return

    try {
      setIsProcessing(true)
      setPaymentError(null)
      setDebugInfo(null)

      // Check if Stripe publishable key is defined
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      if (!publishableKey) {
        console.warn("Stripe publishable key is not defined in environment variables")
      }

      // Get the API URL from environment variable or use a default
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const endpoint = apiUrl ? `${apiUrl}/api/payments/trailer` : "/api/payments/trailer"

      const requestData = {
        trailerId: trailer.id,
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : format(dateRange.from, "yyyy-MM-dd"),
        amount: totalAmount,
        customerEmail,
      }

      console.log("Creating trailer rental payment intent with:", {
        endpoint,
        data: requestData,
        stripeKeyDefined: !!publishableKey,
      })

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      console.log("Payment intent response status:", response.status)

      const responseText = await response.text()
      let responseData

      try {
        responseData = JSON.parse(responseText)
      } catch (e) {
        responseData = { error: "Invalid JSON response", rawResponse: responseText }
      }

      if (!response.ok) {
        console.error("Payment intent creation failed:", response.status, responseData)
        setDebugInfo({
          status: response.status,
          response: responseData,
          request: requestData,
          endpoint,
        })
        throw new Error(responseData.error || responseData.details || "Failed to create payment intent")
      }

      console.log("Payment intent created successfully:", responseData)

      if (!responseData.clientSecret) {
        throw new Error("No client secret returned from the server")
      }

      setClientSecret(responseData.clientSecret)
    } catch (error) {
      console.error("Error creating payment intent:", error)
      setPaymentError(error instanceof Error ? error.message : "Failed to initialize payment")
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    // Create a payment intent when trailer data is loaded and dates are selected
    if (trailer && dateRange.from) {
      initializePayment()
    }
  }, [trailer]) // Only run once when trailer is loaded

  const handlePaymentSuccess = (paymentIntentId: string) => {
    // In a real app, update your database with the rental info
    toast({
      title: "Rental Successful!",
      description: "Your trailer rental has been confirmed.",
    })

    // Redirect to confirmation page
    router.push(`/payment-confirmation?type=trailer&id=${params.id}&payment_intent=${paymentIntentId}`)
  }

  const handleCancel = () => {
    router.back()
  }

  const handleRetry = () => {
    initializePayment()
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
                  src={trailer.imageUrl || "/placeholder.svg?height=300&width=600"}
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
                          if (range?.from) {
                            setDateRange({
                              from: range.from,
                              to: range.to || addDays(range.from, 3),
                            })
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
          {paymentError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment Error</AlertTitle>
              <AlertDescription>
                {paymentError === "Stripe configuration error"
                  ? "There's an issue with the payment system configuration. Please contact support."
                  : paymentError}
                <div className="mt-2">
                  <Button onClick={handleRetry} variant="outline" size="sm">
                    Retry
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {debugInfo && (
            <div className="mb-4 p-4 bg-gray-100 rounded-md text-xs">
              <h4 className="font-bold mb-2">Debug Info:</h4>
              <pre className="overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}

          {isProcessing ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
              <span className="ml-2">Initializing payment...</span>
            </div>
          ) : clientSecret ? (
            <PaymentProvider clientSecret={clientSecret}>
              <PaymentForm amount={totalAmount} onSuccess={handlePaymentSuccess} onCancel={handleCancel} />
            </PaymentProvider>
          ) : !paymentError ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
              <span className="ml-2">Initializing payment...</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
