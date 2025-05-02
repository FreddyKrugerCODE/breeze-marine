import { sql, generateId } from "../db"

export type VideoCall = {
  id: string
  date: Date
  time: string
  purpose: string
  status: string
  meetingLink?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

export async function getVideoCalls(): Promise<VideoCall[]> {
  return await sql<VideoCall[]>(`
    SELECT * FROM "VideoCall"
    ORDER BY date DESC, time ASC
  `)
}

export async function getVideoCallById(id: string): Promise<VideoCall | null> {
  const calls = await sql<VideoCall[]>('SELECT * FROM "VideoCall" WHERE id = $1', [id])
  return calls.length > 0 ? calls[0] : null
}

export async function createVideoCall(call: Omit<VideoCall, "id" | "createdAt" | "updatedAt">): Promise<VideoCall> {
  const id = generateId()
  const now = new Date()

  const result = await sql<VideoCall[]>(
    `
    INSERT INTO "VideoCall" (
      id, date, time, purpose, status, "meetingLink", "customerName", 
      "customerEmail", "customerPhone", notes, "createdAt", "updatedAt"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
    ) RETURNING *
  `,
    [
      id,
      call.date,
      call.time,
      call.purpose,
      call.status || "scheduled",
      call.meetingLink,
      call.customerName,
      call.customerEmail,
      call.customerPhone,
      call.notes,
      now,
      now,
    ],
  )

  return result[0]
}

export async function updateVideoCall(id: string, call: Partial<VideoCall>): Promise<VideoCall | null> {
  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  Object.entries(call).forEach(([key, value]) => {
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
    UPDATE "VideoCall" 
    SET ${updates.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `

  const result = await sql<VideoCall[]>(query, values)
  return result.length > 0 ? result[0] : null
}

export async function getAvailableCallTimes(date: string): Promise<string[]> {
  // Define all possible call times
  const allTimes = ["9:30 AM", "10:30 AM", "11:30 AM", "1:30 PM", "2:30 PM", "3:30 PM"]

  // Get booked times for the date
  const bookedTimes = await sql<{ time: string }[]>(
    `
    SELECT time 
    FROM "VideoCall" 
    WHERE date::date = $1::date
    AND status IN ('scheduled', 'confirmed')
  `,
    [date],
  )

  const bookedCallTimes = bookedTimes.map((slot) => slot.time)

  // Return available times
  return allTimes.filter((time) => !bookedCallTimes.includes(time))
}
