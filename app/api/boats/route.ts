import { NextResponse } from "next/server"
import {
  getBoats,
  getBoatById,
  createBoat,
  updateBoat,
  deleteBoat,
  type BoatFilters,
} from "@/lib/services/boat-service"
import { validateBoatCreate, validateBoatUpdate } from "@/lib/schemas/boat-schema"

export async function GET(request: Request) {
  try {
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
  } catch (error) {
    console.error("Error in GET /api/boats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const { boat: validData, success, error } = validateBoatCreate(body)

    if (!success) {
      return NextResponse.json({ error: "Invalid boat data", details: error }, { status: 400 })
    }

    // Create the boat
    const newBoat = await createBoat(validData)

    if (!newBoat) {
      return NextResponse.json({ error: "Failed to create boat" }, { status: 500 })
    }

    return NextResponse.json(newBoat, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/boats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Boat ID is required" }, { status: 400 })
    }

    const body = await request.json()

    // Validate the request body
    const { boat: validData, success, error } = validateBoatUpdate(body)

    if (!success) {
      return NextResponse.json({ error: "Invalid boat data", details: error }, { status: 400 })
    }

    // Update the boat
    const updatedBoat = await updateBoat(id, validData)

    if (!updatedBoat) {
      return NextResponse.json({ error: "Boat not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(updatedBoat)
  } catch (error) {
    console.error("Error in PUT /api/boats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Boat ID is required" }, { status: 400 })
    }

    const success = await deleteBoat(id)

    if (!success) {
      return NextResponse.json({ error: "Boat not found or delete failed" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/boats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
