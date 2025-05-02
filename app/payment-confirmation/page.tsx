"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function PaymentConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"success" | "processing" | "failed" | "loading">("loading")
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    const checkPaymentStatus = async () => {
      // In a real app, you would verify the payment status with your backend
      const paymentIntent = searchParams.get("payment_intent")
      const redirectStatus = searchParams.get("redirect_status")

      // Simulate API call to check payment status
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (redirectStatus === "succeeded" || paymentIntent) {
        setStatus("success")
        setPaymentDetails({
          id: paymentIntent || "pi_mock_123456",
          amount: 89500 * 1.07, // Example amount
          date: new Date().toISOString(),
        })
      } else if (redirectStatus === "processing") {
        setStatus("processing")
      } else {
        setStatus("failed")
      }
    }

    checkPaymentStatus()
  }, [searchParams])

  return (
    <div className="container py-10 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Payment {status === "loading" ? "Processing" : status.charAt(0).toUpperCase() + status.slice(1)}
          </CardTitle>
          <CardDescription className="text-center">
            {status === "loading" && "Checking your payment status..."}
            {status === "success" && "Your payment has been processed successfully."}
            {status === "processing" && "Your payment is being processed."}
            {status === "failed" && "There was an issue with your payment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {status === "loading" && <Loader2 className="h-16 w-16 animate-spin text-cyan-600" />}
          {status === "success" && <CheckCircle2 className="h-16 w-16 text-green-500" />}
          {status === "processing" && <Loader2 className="h-16 w-16 animate-spin text-amber-500" />}
          {status === "failed" && <XCircle className="h-16 w-16 text-red-500" />}

          {status === "success" && paymentDetails && (
            <div className="mt-6 w-full space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment ID:</span>
                <span className="font-medium">{paymentDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">${paymentDetails.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{new Date(paymentDetails.date).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {status === "failed" && (
            <p className="mt-4 text-center text-muted-foreground">
              Please try again or contact our support team for assistance.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status === "success" && (
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          )}
          {status === "processing" && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          )}
          {status === "failed" && (
            <Button variant="outline" onClick={() => router.back()}>
              Try Again
            </Button>
          )}
          {status === "loading" && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking payment...
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
