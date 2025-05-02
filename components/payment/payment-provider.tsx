"use client"

import { type ReactNode, useEffect, useState } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe-service"
import { Loader2 } from "lucide-react"

interface PaymentProviderProps {
  clientSecret: string
  children: ReactNode
}

export function PaymentProvider({ clientSecret, children }: PaymentProviderProps) {
  const [stripePromise, setStripePromise] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStripe = async () => {
      try {
        const stripe = await getStripe()
        setStripePromise(stripe)
      } catch (error) {
        console.error("Failed to load Stripe:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStripe()
  }, [])

  if (loading || !stripePromise) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
        <span className="ml-2">Loading payment system...</span>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#0891b2", // cyan-600
            colorBackground: "#ffffff",
            colorText: "#1f2937",
            colorDanger: "#ef4444",
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            borderRadius: "0.5rem",
          },
        },
      }}
    >
      {children}
    </Elements>
  )
}
