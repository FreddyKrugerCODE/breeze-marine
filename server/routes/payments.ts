import express from "express"
import Stripe from "stripe"
import { authMiddleware } from "../middleware/auth-middleware"
import { validateRequest } from "../middleware/validate-request"
import { z } from "zod"

const router = express.Router()

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

// Schema for boat payment intent
const boatPaymentSchema = z.object({
  boatId: z.string(),
  amount: z.number().positive(),
  customerEmail: z.string().email(),
})

// Schema for trailer rental payment intent
const trailerPaymentSchema = z.object({
  trailerId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  amount: z.number().positive(),
  customerEmail: z.string().email(),
})

// Schema for service payment intent
const servicePaymentSchema = z.object({
  serviceId: z.string(),
  date: z.string(),
  amount: z.number().positive(),
  customerEmail: z.string().email(),
})

// Create payment intent for boat purchase
router.post("/boat", validateRequest(boatPaymentSchema), async (req, res) => {
  try {
    const { boatId, amount, customerEmail } = req.body

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: "usd",
      metadata: {
        boatId,
        type: "boat_purchase",
      },
      receipt_email: customerEmail,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating boat payment intent:", error)
    res.status(500).json({ error: "Failed to create payment intent" })
  }
})

// Create payment intent for trailer rental
router.post("/trailer", validateRequest(trailerPaymentSchema), async (req, res) => {
  try {
    const { trailerId, startDate, endDate, amount, customerEmail } = req.body

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: "usd",
      metadata: {
        trailerId,
        startDate,
        endDate,
        type: "trailer_rental",
      },
      receipt_email: customerEmail,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating trailer payment intent:", error)
    res.status(500).json({ error: "Failed to create payment intent" })
  }
})

// Create payment intent for service booking
router.post("/service", validateRequest(servicePaymentSchema), async (req, res) => {
  try {
    const { serviceId, date, amount, customerEmail } = req.body

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: "usd",
      metadata: {
        serviceId,
        date,
        type: "service_booking",
      },
      receipt_email: customerEmail,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating service payment intent:", error)
    res.status(500).json({ error: "Failed to create payment intent" })
  }
})

// Webhook handler for Stripe events
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"] as string

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || "")
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`)

      // Handle different payment types based on metadata
      if (paymentIntent.metadata.type === "boat_purchase") {
        // Update boat status to sold
        // Send confirmation email
      } else if (paymentIntent.metadata.type === "trailer_rental") {
        // Update trailer availability
        // Send rental confirmation
      } else if (paymentIntent.metadata.type === "service_booking") {
        // Update service booking status
        // Send service confirmation
      }

      break
    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`Payment failed: ${failedPaymentIntent.last_payment_error?.message}`)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send()
})

// Get payment history for a customer (requires authentication)
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const { customerId } = req.query

    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" })
    }

    // Get payment intents for the customer
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId as string,
      limit: 100,
    })

    res.status(200).json(paymentIntents.data)
  } catch (error) {
    console.error("Error fetching payment history:", error)
    res.status(500).json({ error: "Failed to fetch payment history" })
  }
})

export default router
