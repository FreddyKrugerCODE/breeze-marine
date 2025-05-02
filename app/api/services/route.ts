import { NextResponse } from "next/server"
import { getServices, getServiceById, createService } from "@/lib/services/service-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  // If ID is provided, return specific service
  if (id) {
    const service = await getServiceById(id)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service)
  }

  // Return all services
  const services = await getServices()
  return NextResponse.json(services)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.description || !body.category || body.duration === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const service = await createService({
      name: body.name,
      description: body.description,
      category: body.category,
      price: body.price,
      duration: body.duration,
      active: body.active !== undefined ? body.active : true,
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
