import { NextResponse } from "next/server"
import { z } from "zod"
import { createBooking, getAvailableTimeSlots } from "@/lib/services/booking-service"

// Validation schema for booking request
const bookingSchema = z.object({
  service: z.string(),
  date: z.string().or(z.date()),
  timeSlot: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  boatMake: z.string(),
  boatModel: z.string(),
  boatYear: z.string(),
  boatLength: z.string(),
  notes: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()

    // Convert date string to Date object if needed
    if (typeof body.date === "string") {
      body.date = new Date(body.date)
    }

    // Validate request data
    const result = bookingSchema.safeParse(body)

    if (!result.success) {
      // Return validation errors
      return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 })
    }

    const bookingData = result.data

    // Create booking in database
    const booking = await createBooking({
      serviceId: bookingData.service,
      date: new Date(bookingData.date),
      timeSlot: bookingData.timeSlot,
      status: "pending",
      customerName: bookingData.name,
      customerEmail: bookingData.email,
      customerPhone: bookingData.phone,
      boatMake: bookingData.boatMake,
      boatModel: bookingData.boatModel,
      boatYear: bookingData.boatYear,
      boatLength: bookingData.boatLength,
      notes: bookingData.notes,
    })

    // Return success response with booking reference
    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      bookingReference: booking.id,
      booking,
    })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ error: "Failed to process booking request" }, { status: 500 })
  }
}

// Get available time slots for a specific date
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
  }

  // Get available time slots from database
  const availableTimeSlots = await getAvailableTimeSlots(date)

  return NextResponse.json({
    date,
    availableTimeSlots,
  })
}
