import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: Request) {
  try {
    // Check if Stripe secret key is defined
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      console.error("Stripe secret key is not defined in environment variables")
      return NextResponse.json(
        { error: "Stripe configuration error", details: "Missing Stripe secret key" },
        { status: 500 },
      )
    }

    // Initialize Stripe
    let stripe: Stripe
    try {
      stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2023-10-16", // Use the latest API version
      })
      console.log("Stripe initialized successfully")
    } catch (stripeInitError) {
      console.error("Failed to initialize Stripe:", stripeInitError)
      return NextResponse.json(
        { error: "Stripe configuration error", details: "Invalid Stripe secret key" },
        { status: 500 },
      )
    }

    // Parse request body
    const body = await request.json()
    console.log("Received payment request:", body)

    const { trailerId, startDate, endDate, amount, customerEmail } = body

    // Validate required fields
    if (!trailerId) {
      return NextResponse.json({ error: "Trailer ID is required" }, { status: 400 })
    }
    if (!startDate) {
      return NextResponse.json({ error: "Start date is required" }, { status: 400 })
    }
    if (!endDate) {
      return NextResponse.json({ error: "End date is required" }, { status: 400 })
    }
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 })
    }
    if (!customerEmail) {
      return NextResponse.json({ error: "Customer email is required" }, { status: 400 })
    }

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(amount * 100)

    // Create payment intent
    console.log("Creating Stripe payment intent for trailer rental:", {
      trailerId,
      startDate,
      endDate,
      amount: amountInCents,
      customerEmail,
    })

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        receipt_email: customerEmail,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          trailerId,
          startDate,
          endDate,
          type: "trailer_rental",
        },
      })

      console.log("Payment intent created successfully:", paymentIntent.id)

      return NextResponse.json({ clientSecret: paymentIntent.client_secret })
    } catch (stripeError: any) {
      console.error("Stripe API error:", stripeError)
      return NextResponse.json(
        {
          error: "Stripe configuration error",
          details: stripeError.message || "Error creating payment intent",
          code: stripeError.code || "unknown_error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in trailer payment API route:", error)
    return NextResponse.json(
      { error: "Stripe configuration error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
