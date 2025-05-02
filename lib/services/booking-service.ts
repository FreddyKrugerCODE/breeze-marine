import { sql, generateId } from "../db"

export type Booking = {
  id: string
  serviceId: string
  date: Date
  timeSlot: string
  status: string
  customerName: string
  customerEmail: string
  customerPhone: string
  boatMake: string
  boatModel: string
  boatYear: string
  boatLength: string
  notes?: string
  paymentStatus?: string
  paymentIntentId?: string
  createdAt?: Date
  updatedAt?: Date
}

export type BookingWithService = Booking & {
  serviceName: string
}

export async function getBookings(): Promise<BookingWithService[]> {
  const bookings = await sql<BookingWithService[]>(`
    SELECT b.*, s.name as "serviceName"
    FROM "Booking" b
    LEFT JOIN "Service" s ON b."serviceId" = s.id
    ORDER BY b.date DESC
  `)

  return bookings
}

export async function getBookingById(id: string): Promise<BookingWithService | null> {
  const bookings = await sql<BookingWithService[]>(
    `
    SELECT b.*, s.name as "serviceName"
    FROM "Booking" b
    LEFT JOIN "Service" s ON b."serviceId" = s.id
    WHERE b.id = $1
  `,
    [id],
  )

  return bookings.length > 0 ? bookings[0] : null
}

export async function createBooking(booking: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking> {
  const id = generateId()
  const now = new Date()

  const result = await sql<Booking[]>(
    `
    INSERT INTO "Booking" (
      id, "serviceId", date, "timeSlot", status, "customerName", "customerEmail", 
      "customerPhone", "boatMake", "boatModel", "boatYear", "boatLength", 
      notes, "paymentStatus", "paymentIntentId", "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
    ) RETURNING *
  `,
    [
      id,
      booking.serviceId,
      booking.date,
      booking.timeSlot,
      booking.status || "pending",
      booking.customerName,
      booking.customerEmail,
      booking.customerPhone,
      booking.boatMake,
      booking.boatModel,
      booking.boatYear,
      booking.boatLength,
      booking.notes,
      booking.paymentStatus,
      booking.paymentIntentId,
      now,
      now,
    ],
  )

  return result[0]
}

export async function updateBooking(id: string, booking: Partial<Booking>): Promise<Booking | null> {
  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  Object.entries(booking).forEach(([key, value]) => {
    if (key !== "id" && key !== "createdAt") {
      updates.push(`"${key}" = $${paramIndex}`)
      values.push(value)
      paramIndex++
    }
  })

  updates.push(`"updatedAt" = $${paramIndex}`)
  values.push(new Date())
  paramIndex++

  values.push(id)

  const query = `
    UPDATE "Booking" 
    SET ${updates.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `

  const result = await sql<Booking[]>(query, values)
  return result.length > 0 ? result[0] : null
}

export async function deleteBooking(id: string): Promise<boolean> {
  const result = await sql<{ count: number }[]>(
    `
    DELETE FROM "Booking" WHERE id = $1
    RETURNING COUNT(*) as count
  `,
    [id],
  )

  return result[0].count > 0
}

export async function getAvailableTimeSlots(date: string): Promise<string[]> {
  // Define all possible time slots
  const allTimeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

  // Get booked time slots for the date
  const bookedSlots = await sql<{ timeSlot: string }[]>(
    `
    SELECT "timeSlot" 
    FROM "Booking" 
    WHERE date::date = $1::date
    AND status IN ('pending', 'confirmed')
  `,
    [date],
  )

  const bookedTimeSlots = bookedSlots.map((slot) => slot.timeSlot)

  // Return available time slots
  return allTimeSlots.filter((slot) => !bookedTimeSlots.includes(slot))
}
