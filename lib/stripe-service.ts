import { loadStripe } from "@stripe/stripe-js"

// Initialize Stripe with your publishable key
export const getStripe = async () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  if (!publishableKey) {
    throw new Error("Stripe publishable key is not defined")
  }

  return await loadStripe(publishableKey)
}

// Create a payment intent for a boat purchase
export const createBoatPaymentIntent = async (boatId: string, amount: number, customerEmail: string) => {
  try {
    const response = await fetch(`/api/payments/boat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        boatId,
        amount,
        customerEmail,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Payment intent creation failed:", response.status, errorData)
      throw new Error(errorData.error || "Failed to create payment intent")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw error
  }
}

// Create a payment intent for a trailer rental
export const createTrailerRentalPaymentIntent = async (
  trailerId: string,
  startDate: string,
  endDate: string,
  amount: number,
  customerEmail: string,
) => {
  try {
    // Validate inputs before sending
    if (!trailerId) throw new Error("Trailer ID is required")
    if (!startDate) throw new Error("Start date is required")
    if (!endDate) throw new Error("End date is required")
    if (!amount || amount <= 0) throw new Error("Valid amount is required")
    if (!customerEmail) throw new Error("Customer email is required")

    console.log("Creating trailer rental payment intent:", {
      trailerId,
      startDate,
      endDate,
      amount,
      customerEmail,
    })

    const response = await fetch(`/api/payments/trailer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trailerId,
        startDate,
        endDate,
        amount,
        customerEmail,
      }),
    })

    // Log the response status for debugging
    console.log("Payment intent response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      let errorData = {}

      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        // If it's not JSON, use the text as is
        errorData = { error: errorText }
      }

      console.error("Payment intent creation failed:", response.status, errorData)
      throw new Error(errorData.error || "Failed to create payment intent")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating trailer rental payment intent:", error)
    throw error
  }
}

// Create a payment intent for a service booking
export const createServicePaymentIntent = async (
  serviceId: string,
  date: string,
  amount: number,
  customerEmail: string,
) => {
  try {
    const response = await fetch(`/api/payments/service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceId,
        date,
        amount,
        customerEmail,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Payment intent creation failed:", response.status, errorData)
      throw new Error(errorData.error || "Failed to create payment intent")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw error
  }
}