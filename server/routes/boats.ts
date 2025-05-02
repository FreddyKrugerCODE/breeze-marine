import express from "express"
import { z } from "zod"
import { validateRequest } from "../middleware/validate-request"

const router = express.Router()

// Mock data - in a real app, this would come from your database
const boats = [
  {
    id: "boat-1",
    name: "Sea Ray 250 SDX",
    price: 89500,
    year: 2022,
    length: 25,
    type: "Bowrider",
    manufacturer: "Sea Ray",
    description:
      "Luxury bowrider with premium features and excellent performance. Perfect for day cruising and water sports.",
    features: ["GPS Navigation", "Stereo System", "Swim Platform", "Bathroom"],
    imageUrl: "/placeholder.svg?height=225&width=400",
    status: "available",
  },
  {
    id: "boat-2",
    name: "Boston Whaler 280 Outrage",
    price: 175000,
    year: 2021,
    length: 28,
    type: "Center Console",
    manufacturer: "Boston Whaler",
    description: "Versatile center console fishing boat with unsinkable construction and premium amenities.",
    features: ["Fish Finder", "Live Well", "Trolling Motor", "GPS Navigation"],
    imageUrl: "/placeholder.svg?height=225&width=400",
    status: "available",
  },
  {
    id: "boat-3",
    name: "Chaparral 23 SSi",
    price: 65000,
    year: 2020,
    length: 23,
    type: "Bowrider",
    manufacturer: "Chaparral",
    description: "Sporty bowrider with excellent handling and comfortable seating for the whole family.",
    features: ["Stereo System", "Swim Platform", "Bimini Top"],
    imageUrl: "/placeholder.svg?height=225&width=400",
    status: "pending",
  },
  {
    id: "boat-4",
    name: "Bennington 25 QX Fastback",
    price: 110000,
    year: 2023,
    length: 25,
    type: "Pontoon",
    manufacturer: "Bennington",
    description: "Luxury pontoon boat with high-performance features and premium comfort amenities.",
    features: ["GPS Navigation", "Stereo System", "Bathroom", "Kitchen"],
    imageUrl: "/placeholder.svg?height=225&width=400",
    status: "available",
  },
  {
    id: "boat-5",
    name: "MasterCraft X24",
    price: 145000,
    year: 2022,
    length: 24,
    type: "Wakeboard Boat",
    manufacturer: "MasterCraft",
    description: "Premium wakeboard boat with customizable wake settings and luxury interior.",
    features: ["Stereo System", "Swim Platform", "GPS Navigation", "Bathroom"],
    imageUrl: "/placeholder.svg?height=225&width=400",
    status: "sold",
  },
  {
    id: "boat-6",
    name: "Grady-White 251 Coastal Explorer",
    price: 120000,
    year: 2021,
    length: 25,
    type: "Center Console",
    manufacturer: "Grady-White",
    description: "Versatile center console designed for both fishing and family fun.",
    features: ["Fish Finder", "Live Well", "GPS Navigation", "Stereo System"],
    imageUrl: "/placeholder.svg?height=225&width=400",
    status: "available",
  },
]

// Schema for filtering boats
const boatFilterSchema = z.object({
  keyword: z.string().optional(),
  type: z.string().optional(),
  manufacturer: z.string().optional(),
  minPrice: z
    .string()
    .transform((val) => Number.parseInt(val))
    .optional(),
  maxPrice: z
    .string()
    .transform((val) => Number.parseInt(val))
    .optional(),
  minLength: z
    .string()
    .transform((val) => Number.parseInt(val))
    .optional(),
  maxLength: z
    .string()
    .transform((val) => Number.parseInt(val))
    .optional(),
  minYear: z
    .string()
    .transform((val) => Number.parseInt(val))
    .optional(),
  maxYear: z
    .string()
    .transform((val) => Number.parseInt(val))
    .optional(),
  features: z.string().optional(),
  sort: z.string().optional(),
})

// Get all boats with filtering
router.get("/", async (req, res) => {
  try {
    const filters = boatFilterSchema.parse(req.query)

    let filteredBoats = [...boats]

    // Apply filters
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      filteredBoats = filteredBoats.filter(
        (boat) => boat.name.toLowerCase().includes(keyword) || boat.description.toLowerCase().includes(keyword),
      )
    }

    if (filters.type) {
      filteredBoats = filteredBoats.filter((boat) => boat.type === filters.type)
    }

    if (filters.manufacturer) {
      filteredBoats = filteredBoats.filter((boat) => boat.manufacturer === filters.manufacturer)
    }

    if (filters.minPrice !== undefined) {
      filteredBoats = filteredBoats.filter((boat) => boat.price >= filters.minPrice!)
    }

    if (filters.maxPrice !== undefined) {
      filteredBoats = filteredBoats.filter((boat) => boat.price <= filters.maxPrice!)
    }

    if (filters.minLength !== undefined) {
      filteredBoats = filteredBoats.filter((boat) => boat.length >= filters.minLength!)
    }

    if (filters.maxLength !== undefined) {
      filteredBoats = filteredBoats.filter((boat) => boat.length <= filters.maxLength!)
    }

    if (filters.minYear !== undefined) {
      filteredBoats = filteredBoats.filter((boat) => boat.year >= filters.minYear!)
    }

    if (filters.maxYear !== undefined) {
      filteredBoats = filteredBoats.filter((boat) => boat.year <= filters.maxYear!)
    }

    if (filters.features) {
      const requiredFeatures = filters.features.split(",")
      filteredBoats = filteredBoats.filter((boat) =>
        requiredFeatures.every((feature) => boat.features.includes(feature)),
      )
    }

    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case "price-asc":
          filteredBoats.sort((a, b) => a.price - b.price)
          break
        case "price-desc":
          filteredBoats.sort((a, b) => b.price - a.price)
          break
        case "year-desc":
          filteredBoats.sort((a, b) => b.year - a.year)
          break
        case "year-asc":
          filteredBoats.sort((a, b) => a.year - b.year)
          break
        case "length-desc":
          filteredBoats.sort((a, b) => b.length - a.length)
          break
        case "length-asc":
          filteredBoats.sort((a, b) => a.length - b.length)
          break
        default:
          // Default sorting (newest first)
          filteredBoats.sort((a, b) => b.year - a.year)
      }
    }

    res.status(200).json(filteredBoats)
  } catch (error) {
    console.error("Error fetching boats:", error)
    res.status(500).json({ error: "Failed to fetch boats" })
  }
})

// Get boat by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const boat = boats.find((boat) => boat.id === id)

    if (!boat) {
      return res.status(404).json({ error: "Boat not found" })
    }

    res.status(200).json(boat)
  } catch (error) {
    console.error("Error fetching boat:", error)
    res.status(500).json({ error: "Failed to fetch boat" })
  }
})

// Schema for creating/updating a boat
const boatSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  year: z.number().int().positive(),
  length: z.number().positive(),
  type: z.string().min(1),
  manufacturer: z.string().min(1),
  description: z.string().min(1),
  features: z.array(z.string()),
  imageUrl: z.string().optional(),
  status: z.enum(["available", "pending", "sold"]),
})

// Create a new boat
router.post("/", validateRequest(boatSchema), async (req, res) => {
  try {
    const newBoat = {
      id: `boat-${boats.length + 1}`,
      ...req.body,
    }

    boats.push(newBoat)

    res.status(201).json(newBoat)
  } catch (error) {
    console.error("Error creating boat:", error)
    res.status(500).json({ error: "Failed to create boat" })
  }
})

// Update a boat
router.put("/:id", validateRequest(boatSchema), async (req, res) => {
  try {
    const { id } = req.params
    const boatIndex = boats.findIndex((boat) => boat.id === id)

    if (boatIndex === -1) {
      return res.status(404).json({ error: "Boat not found" })
    }

    boats[boatIndex] = {
      ...boats[boatIndex],
      ...req.body,
      id, // Preserve the original ID
    }

    res.status(200).json(boats[boatIndex])
  } catch (error) {
    console.error("Error updating boat:", error)
    res.status(500).json({ error: "Failed to update boat" })
  }
})

// Delete a boat
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const boatIndex = boats.findIndex((boat) => boat.id === id)

    if (boatIndex === -1) {
      return res.status(404).json({ error: "Boat not found" })
    }

    const deletedBoat = boats.splice(boatIndex, 1)[0]

    res.status(200).json(deletedBoat)
  } catch (error) {
    console.error("Error deleting boat:", error)
    res.status(500).json({ error: "Failed to delete boat" })
  }
})

export default router
