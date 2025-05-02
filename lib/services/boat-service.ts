import { sql, generateId } from "../db"

export type Boat = {
  id: string
  title: string
  make: string
  model: string
  year: number
  length: string
  price: number
  engine: string
  hours: number
  condition: string
  description: string
  features: string[]
  images: string[]
  status: string
  createdAt?: Date
  updatedAt?: Date
}

export type BoatFilters = {
  keyword?: string
  make?: string
  type?: string
  manufacturer?: string
  minPrice?: number
  maxPrice?: number
  minLength?: number
  maxLength?: number
  minYear?: number
  maxYear?: number
  features?: string[]
}

export async function getBoats(filters: BoatFilters = {}): Promise<Boat[]> {
  let query = `
    SELECT * FROM "Boat"
    WHERE 1=1
  `

  const params: any[] = []
  let paramIndex = 1

  if (filters.keyword) {
    query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR make ILIKE $${paramIndex} OR model ILIKE $${paramIndex})`
    params.push(`%${filters.keyword}%`)
    paramIndex++
  }

  if (filters.make) {
    query += ` AND make ILIKE $${paramIndex}`
    params.push(`%${filters.make}%`)
    paramIndex++
  }

  if (filters.manufacturer) {
    query += ` AND make = $${paramIndex}`
    params.push(filters.manufacturer)
    paramIndex++
  }

  if (filters.minPrice) {
    query += ` AND price >= $${paramIndex}`
    params.push(filters.minPrice)
    paramIndex++
  }

  if (filters.maxPrice) {
    query += ` AND price <= $${paramIndex}`
    params.push(filters.maxPrice)
    paramIndex++
  }

  if (filters.minYear) {
    query += ` AND year >= $${paramIndex}`
    params.push(filters.minYear)
    paramIndex++
  }

  if (filters.maxYear) {
    query += ` AND year <= $${paramIndex}`
    params.push(filters.maxYear)
    paramIndex++
  }

  query += ` ORDER BY "createdAt" DESC`

  const boats = await sql<Boat[]>(query, params)
  return boats
}

export async function getBoatById(id: string): Promise<Boat | null> {
  const boats = await sql<Boat[]>('SELECT * FROM "Boat" WHERE id = $1', [id])
  return boats.length > 0 ? boats[0] : null
}

export async function createBoat(boat: Omit<Boat, "id" | "createdAt" | "updatedAt">): Promise<Boat> {
  const id = generateId()
  const now = new Date()

  const result = await sql<Boat[]>(
    `
    INSERT INTO "Boat" (
      id, title, make, model, year, length, price, engine, hours, 
      condition, description, features, images, status, "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
    ) RETURNING *
  `,
    [
      id,
      boat.title,
      boat.make,
      boat.model,
      boat.year,
      boat.length,
      boat.price,
      boat.engine,
      boat.hours,
      boat.condition,
      boat.description,
      boat.features,
      boat.images,
      boat.status || "available",
      now,
      now,
    ],
  )

  return result[0]
}

export async function updateBoat(id: string, boat: Partial<Boat>): Promise<Boat | null> {
  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  // Build dynamic update query based on provided fields
  Object.entries(boat).forEach(([key, value]) => {
    if (key !== "id" && key !== "createdAt") {
      updates.push(`"${key}" = $${paramIndex}`)
      values.push(value)
      paramIndex++
    }
  })

  // Add updatedAt
  updates.push(`"updatedAt" = $${paramIndex}`)
  values.push(new Date())
  paramIndex++

  // Add id as the last parameter
  values.push(id)

  const query = `
    UPDATE "Boat" 
    SET ${updates.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `

  const result = await sql<Boat[]>(query, values)
  return result.length > 0 ? result[0] : null
}

export async function deleteBoat(id: string): Promise<boolean> {
  const result = await sql<{ count: number }[]>(
    `
    DELETE FROM "Boat" WHERE id = $1
    RETURNING COUNT(*) as count
  `,
    [id],
  )

  return result[0].count > 0
}
