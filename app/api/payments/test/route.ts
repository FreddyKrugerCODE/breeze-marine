import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET() {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    if (!stripeSecretKey) {
      return NextResponse.json({
        success: false,
        error: "Stripe secret key is not defined in environment variables",
      })
    }

    if (!stripePublishableKey) {
      return NextResponse.json({
        success: false,
        error: "Stripe publishable key is not defined in environment variables",
      })
    }

    // Test Stripe initialization
    try {
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2023-10-16",
      })

      // Test API connection by making a simple request
      const paymentMethods = await stripe.paymentMethods.list({
        limit: 1,
        type: "card",
      })

      return NextResponse.json({
        success: true,
        message: "Stripe configuration is valid",
        details: {
          secretKeyValid: true,
          publishableKeyValid: stripePublishableKey.startsWith("pk_"),
          apiConnection: "successful",
        },
      })
    } catch (stripeError: any) {
      return NextResponse.json({
        success: false,
        error: "Stripe API error",
        details: stripeError.message,
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Test failed",
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
