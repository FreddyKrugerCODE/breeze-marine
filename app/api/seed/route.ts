import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/seed-data"

export async function POST(request: Request) {
  try {
    // Check for authorization (in production, you'd want to restrict this endpoint)
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (key !== process.env.SEED_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await seedDatabase()

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
    })
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
