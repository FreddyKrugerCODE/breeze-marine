import { sql, generateId } from "../db"

export type Service = {
  id: string
  name: string
  description: string
  category: string
  price: number | null
  duration: number
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

export async function getServices(): Promise<Service[]> {
  return await sql<Service[]>(`
    SELECT * FROM "Service"
    WHERE active = true
    ORDER BY name ASC
  `)
}

export async function getServiceById(id: string): Promise<Service | null> {
  const services = await sql<Service[]>('SELECT * FROM "Service" WHERE id = $1', [id])
  return services.length > 0 ? services[0] : null
}

export async function createService(service: Omit<Service, "id" | "createdAt" | "updatedAt">): Promise<Service> {
  const id = generateId()
  const now = new Date()

  const result = await sql<Service[]>(
    `
    INSERT INTO "Service" (
      id, name, description, category, price, duration, active, "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    ) RETURNING *
  `,
    [
      id,
      service.name,
      service.description,
      service.category,
      service.price,
      service.duration,
      service.active !== undefined ? service.active : true,
      now,
      now,
    ],
  )

  return result[0]
}

export async function updateService(id: string, service: Partial<Service>): Promise<Service | null> {
  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  Object.entries(service).forEach(([key, value]) => {
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
    UPDATE "Service" 
    SET ${updates.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `

  const result = await sql<Service[]>(query, values)
  return result.length > 0 ? result[0] : null
}

export async function deleteService(id: string): Promise<boolean> {
  const result = await sql<{ count: number }[]>(
    `
    DELETE FROM "Service" WHERE id = $1
    RETURNING COUNT(*) as count
  `,
    [id],
  )

  return result[0].count > 0
}
