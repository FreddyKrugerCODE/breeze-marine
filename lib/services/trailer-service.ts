import { sql, generateId } from "../db"

export type Trailer = {
  id: string
  type: string
  capacity: number
  description: string
  dailyRate: number
  weekendRate: number
  weeklyRate: number
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

export type TrailerRental = {
  id: string
  trailerId: string
  startDate: Date
  endDate: Date
  status: string
  customerName: string
  customerEmail: string
  customerPhone: string
  driversLicense: string
  towVehicle: string
  notes?: string
  totalPrice: number
  paymentStatus?: string
  paymentIntentId?: string
  createdAt?: Date
  updatedAt?: Date
}

export type TrailerRentalWithTrailer = TrailerRental & {
  trailerType: string
}

export async function getTrailers(): Promise<Trailer[]> {
  return await sql<Trailer[]>(`
    SELECT * FROM "Trailer"
    WHERE active = true
    ORDER BY capacity ASC
  `)
}

export async function getTrailerById(id: string): Promise<Trailer | null> {
  const trailers = await sql<Trailer[]>('SELECT * FROM "Trailer" WHERE id = $1', [id])
  return trailers.length > 0 ? trailers[0] : null
}

export async function createTrailer(trailer: Omit<Trailer, "id" | "createdAt" | "updatedAt">): Promise<Trailer> {
  const id = generateId()
  const now = new Date()

  const result = await sql<Trailer[]>(
    `
    INSERT INTO "Trailer" (
      id, type, capacity, description, "dailyRate", "weekendRate", "weeklyRate", 
      active, "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    ) RETURNING *
  `,
    [
      id,
      trailer.type,
      trailer.capacity,
      trailer.description,
      trailer.dailyRate,
      trailer.weekendRate,
      trailer.weeklyRate,
      trailer.active !== undefined ? trailer.active : true,
      now,
      now,
    ],
  )

  return result[0]
}

export async function updateTrailer(id: string, trailer: Partial<Trailer>): Promise<Trailer | null> {
  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  Object.entries(trailer).forEach(([key, value]) => {
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
    UPDATE "Trailer" 
    SET ${updates.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `

  const result = await sql<Trailer[]>(query, values)
  return result.length > 0 ? result[0] : null
}

export async function getRentals(): Promise<TrailerRentalWithTrailer[]> {
  return await sql<TrailerRentalWithTrailer[]>(`
    SELECT r.*, t.type as "trailerType"
    FROM "TrailerRental" r
    JOIN "Trailer" t ON r."trailerId" = t.id
    ORDER BY r."startDate" DESC
  `)
}

export async function getRentalById(id: string): Promise<TrailerRentalWithTrailer | null> {
  const rentals = await sql<TrailerRentalWithTrailer[]>(
    `
    SELECT r.*, t.type as "trailerType"
    FROM "TrailerRental" r
    JOIN "Trailer" t ON r."trailerId" = t.id
    WHERE r.id = $1
  `,
    [id],
  )

  return rentals.length > 0 ? rentals[0] : null
}

export async function createRental(
  rental: Omit<TrailerRental, "id" | "createdAt" | "updatedAt">,
): Promise<TrailerRental> {
  const id = generateId()
  const now = new Date()

  const result = await sql<TrailerRental[]>(
    `
    INSERT INTO "TrailerRental" (
      id, "trailerId", "startDate", "endDate", status, "customerName", 
      "customerEmail", "customerPhone", "driversLicense", "towVehicle", 
      notes, "totalPrice", "paymentStatus", "paymentIntentId", "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
    ) RETURNING *
  `,
    [
      id,
      rental.trailerId,
      rental.startDate,
      rental.endDate,
      rental.status || "pending",
      rental.customerName,
      rental.customerEmail,
      rental.customerPhone,
      rental.driversLicense,
      rental.towVehicle,
      rental.notes,
      rental.totalPrice,
      rental.paymentStatus,
      rental.paymentIntentId,
      now,
      now,
    ],
  )

  return result[0]
}

export async function checkTrailerAvailability(
  trailerId: string,
  startDate: string,
  endDate: string,
): Promise<boolean> {
  const overlappingRentals = await sql<{ count: number }[]>(
    `
    SELECT COUNT(*) as count
    FROM "TrailerRental"
    WHERE "trailerId" = $1
    AND status IN ('pending', 'confirmed', 'active')
    AND (
      ("startDate" <= $2::timestamp AND "endDate" >= $2::timestamp) OR
      ("startDate" <= $3::timestamp AND "endDate" >= $3::timestamp) OR
      ("startDate" >= $2::timestamp AND "endDate" <= $3::timestamp)
    )
  `,
    [trailerId, startDate, endDate],
  )

  return overlappingRentals[0].count === 0
}
