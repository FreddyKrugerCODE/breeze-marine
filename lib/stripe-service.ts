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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/boat`, {
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
      throw new Error("Failed to create payment intent")
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/trailer`, {
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

    if (!response.ok) {
      throw new Error("Failed to create payment intent")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating payment intent:", error)
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/service`, {
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
      throw new Error("Failed to create payment intent")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw error
  }
}
