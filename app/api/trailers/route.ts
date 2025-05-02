import { NextResponse } from "next/server"
import { z } from "zod"

// Mock trailer data - in a real application, this would come from a database
const trailers = [
  {
    id: "single-3000",
    type: "Single Axle",
    capacity: 3000,
    description: "Single axle trailer suitable for boats up to 18ft",
    dailyRate: 75,
    weekendRate: 150,
    weeklyRate: 375,
    available: true,
  },
  {
    id: "single-5000",
    type: "Single Axle",
    capacity: 5000,
    description: "Heavy duty single axle trailer suitable for boats up to 21ft",
    dailyRate: 95,
    weekendRate: 190,
    weeklyRate: 475,
    available: true,
  },
  {
    id: "tandem-7000",
    type: "Tandem Axle",
    capacity: 7000,
    description: "Tandem axle trailer suitable for boats up to 26ft",
    dailyRate: 125,
    weekendRate: 250,
    weeklyRate: 625,
    available: true,
  },
  {
    id: "tandem-10000",
    type: "Tandem Axle",
    capacity: 10000,
    description: "Heavy duty tandem axle trailer suitable for boats up to 30ft",
    dailyRate: 150,
    weekendRate: 300,
    weeklyRate: 750,
    available: true,
  },
]

// Validation schema for trailer rental request
const rentalSchema = z.object({
  trailerId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  driversLicense: z.string(),
  towVehicle: z.string(),
  notes: z.string().optional(),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  // If ID is provided, return specific trailer
  if (id) {
    const trailer = trailers.find((t) => t.id === id)

    if (!trailer) {
      return NextResponse.json({ error: "Trailer not found" }, { status: 404 })
    }

    return NextResponse.json(trailer)
  }

  // Check availability for a date range
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  if (startDate && endDate) {
    // In a real application, you would query your database to check availability
    // For now, we'll just return all trailers with an availability flag

    // Mock availability check
    return NextResponse.json({
      startDate,
      endDate,
      availableTrailers: trailers.map((trailer) => ({
        ...trailer,
        available: Math.random() > 0.3, // Randomly mark some as unavailable
      })),
    })
  }

  // Return all trailers
  return NextResponse.json(trailers)
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate request data
    const result = rentalSchema.safeParse(body)

    if (!result.success) {
      // Return validation errors
      return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 })
    }

    const rental = result.data

    // Here you would typically:
    // 1. Check if the trailer is available for the requested dates
    // 2. Save the rental to your database
    // 3. Update trailer availability
    // 4. Send confirmation emails

    // For now, we'll just simulate a successful rental

    // Simulate database operation
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Return success response with rental reference
    return NextResponse.json({
      success: true,
      message: "Trailer rental confirmed",
      rentalReference: `TR-${Date.now().toString().slice(-6)}`,
      rental,
    })
  } catch (error) {
    console.error("Trailer rental error:", error)
    return NextResponse.json({ error: "Failed to process trailer rental request" }, { status: 500 })
  }
}
