import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const videoCalls = await sql`
      SELECT * FROM "VideoCall" ORDER BY date DESC
    `
    return NextResponse.json(videoCalls)
  } catch (error) {
    console.error("Error fetching video calls:", error)
    return NextResponse.json({ error: "Failed to fetch video calls" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { date, time, purpose, customerName, customerEmail, customerPhone, notes } = body

    // Validate required fields
    if (!date || !time || !purpose || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO "VideoCall" (
        id, date, time, purpose, status, customerName, customerEmail, customerPhone, notes
      ) VALUES (
        ${"vc-" + Date.now()}, ${date}, ${time}, ${purpose}, 'scheduled', 
        ${customerName}, ${customerEmail}, ${customerPhone}, ${notes || null}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating video call:", error)
    return NextResponse.json({ error: "Failed to create video call" }, { status: 500 })
  }
}
