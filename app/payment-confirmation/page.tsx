"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PaymentConfirmationPage() {
  const searchParams = useSearchParams()
  const paymentIntentId = searchParams.get("payment_intent")
  const type = searchParams.get("type") || "payment"
  const id = searchParams.get("id")
  
  const [confirmationDetails, setConfirmationDetails] = useState({
    title: "Payment Successful",
    description: "Thank you for your payment.",
    details: [] as { label: string; value: string }[],
  })

  useEffect(() => {
    // In a real app, you would fetch the payment details from your API
    // For now, we'll just set some mock data based on the payment type
    if (type === "trailer") {
      setConfirmationDetails({
        title: "Trailer Rental Confirmed",
        description: "Your trailer rental has been successfully processed.",
        details: [
          { label: "Confirmation Number", value: paymentIntentId?.substring(3, 11) || "CONF12345" },
          { label: "Trailer ID", value: id || "trailer-1" },
          { label: "Payment Status", value: "Paid" },
        ],
      })
    } else if (type === "boat") {
      setConfirmationDetails({
        title: "Boat Purchase Confirmed",
        description: "Your boat purchase has been successfully processed.",
        details: [
          { label: "Confirmation Number", value: paymentIntentId?.substring(3, 11) || "CONF12345" },
          { label: "Boat ID", value: id || "boat-1" },
          { label: "Payment Status", value: "Paid" },
        ],
      })
    } else if (type === "service") {
      setConfirmationDetails({
        title: "Service Booking Confirmed",
        description: "Your service booking has been successfully processed.",
        details: [
          { label: "Confirmation Number", value: paymentIntentId?.substring(3, 11) || "CONF12345" },
          { label: "Service ID", value: id || "service-1" },
          { label: "Payment Status", value: "Paid" },
        ],
      })
    }
  }, [type, id, paymentIntentId])

  return (
    <div className="container py-10">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">{confirmationDetails.title}</CardTitle>
            <CardDescription>{confirmationDetails.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {confirmationDetails.details.map((detail, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted-foreground">{detail.label}:</span>
                  <span className="font-medium">{detail.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}