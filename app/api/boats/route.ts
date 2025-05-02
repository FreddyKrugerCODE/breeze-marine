import { NextResponse } from "next/server"
import { getBoats, getBoatById, type BoatFilters } from "@/lib/services/boat-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  // If ID is provided, return specific boat
  if (id) {
    const boat = await getBoatById(id)

    if (!boat) {
      return NextResponse.json({ error: "Boat not found" }, { status: 404 })
    }

    return NextResponse.json(boat)
  }

  // Handle filtering
  const filters: BoatFilters = {}

  // Parse search parameters
  if (searchParams.has("keyword")) filters.keyword = searchParams.get("keyword") || undefined
  if (searchParams.has("make")) filters.make = searchParams.get("make") || undefined
  if (searchParams.has("type")) filters.type = searchParams.get("type") || undefined
  if (searchParams.has("manufacturer")) filters.manufacturer = searchParams.get("manufacturer") || undefined

  if (searchParams.has("minPrice")) filters.minPrice = Number(searchParams.get("minPrice"))
  if (searchParams.has("maxPrice")) filters.maxPrice = Number(searchParams.get("maxPrice"))
  if (searchParams.has("minLength")) filters.minLength = Number(searchParams.get("minLength"))
  if (searchParams.has("maxLength")) filters.maxLength = Number(searchParams.get("maxLength"))
  if (searchParams.has("minYear")) filters.minYear = Number(searchParams.get("minYear"))
  if (searchParams.has("maxYear")) filters.maxYear = Number(searchParams.get("maxYear"))

  if (searchParams.has("features")) {
    const featuresParam = searchParams.get("features")
    if (featuresParam) {
      filters.features = featuresParam.split(",")
    }
  }

  // Get filtered boats from database
  const boats = await getBoats(filters)

  // Return filtered boats
  return NextResponse.json(boats)
}
