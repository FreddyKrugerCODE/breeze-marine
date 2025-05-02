import { sql, generateId } from "../db"
import { validateBoat, validateBoatCreate, validateBoatUpdate, type BoatSchemaType } from "../schemas/boat-schema"

export type Boat = BoatSchemaType

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

  try {
    const rawBoats = await sql<any[]>(query, params)

    // Validate each boat and filter out invalid ones
    const validatedBoats: Boat[] = []

    for (const rawBoat of rawBoats) {
      const { boat, success } = validateBoat(rawBoat)
      if (success && boat) {
        validatedBoats.push(boat)
      } else {
        console.error("Invalid boat data:", rawBoat)
      }
    }

    return validatedBoats
  } catch (error) {
    console.error("Error fetching boats:", error)
    return []
  }
}

export async function getBoatById(id: string): Promise<Boat | null> {
  try {
    const boats = await sql<any[]>('SELECT * FROM "Boat" WHERE id = $1', [id])

    if (boats.length === 0) {
      return null
    }

    const { boat, success, error } = validateBoat(boats[0])

    if (!success) {
      console.error(`Invalid boat data for ID ${id}:`, error)
      return null
    }

    return boat
  } catch (error) {
    console.error(`Error fetching boat with ID ${id}:`, error)
    return null
  }
}

export async function createBoat(boatData: Omit<Boat, "id" | "createdAt" | "updatedAt">): Promise<Boat | null> {
  try {
    const { boat: validatedData, success, error } = validateBoatCreate(boatData)

    if (!success || !validatedData) {
      console.error("Invalid boat data for creation:", error)
      return null
    }

    const id = generateId()
    const now = new Date()

    // Ensure arrays are not null
    const features = validatedData.features || []
    const images = validatedData.images || []
    const status = validatedData.status || "available"

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
        validatedData.title,
        validatedData.make,
        validatedData.model,
        validatedData.year,
        validatedData.length,
        validatedData.price,
        validatedData.engine,
        validatedData.hours,
        validatedData.condition,
        validatedData.description,
        features,
        images,
        status,
        now,
        now,
      ],
    )

    const { boat: createdBoat, success: validationSuccess } = validateBoat(result[0])

    if (!validationSuccess) {
      console.error("Created boat failed validation:", result[0])
      return null
    }

    return createdBoat
  } catch (error) {
    console.error("Error creating boat:", error)
    return null
  }
}

export async function updateBoat(id: string, boatData: Partial<Boat>): Promise<Boat | null> {
  try {
    const { boat: validatedData, success, error } = validateBoatUpdate(boatData)

    if (!success || !validatedData) {
      console.error(`Invalid boat data for update of ID ${id}:`, error)
      return null
    }

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    // Build dynamic update query based on provided fields
    Object.entries(validatedData).forEach(([key, value]) => {
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

    const result = await sql<any[]>(query, values)

    if (result.length === 0) {
      return null
    }

    const { boat: updatedBoat, success: validationSuccess } = validateBoat(result[0])

    if (!validationSuccess) {
      console.error("Updated boat failed validation:", result[0])
      return null
    }

    return updatedBoat
  } catch (error) {
    console.error(`Error updating boat with ID ${id}:`, error)
    return null
  }
}

export async function deleteBoat(id: string): Promise<boolean> {
  try {
    const result = await sql<{ count: number }[]>(
      `
      DELETE FROM "Boat" WHERE id = $1
      RETURNING COUNT(*) as count
    `,
      [id],
    )

    return result[0].count > 0
  } catch (error) {
    console.error(`Error deleting boat with ID ${id}:`, error)
    return false
  }
}
