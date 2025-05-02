import express from "express"
import { z } from "zod"
import { validateRequest } from "../middleware/validate-request"
import { authorize } from "../middleware/auth-middleware"

const router = express.Router()

// Mock trailers data
let trailers = [
  {
    id: "single-3000",
    type: "Single Axle",
    capacity: 3000,
    description: "Single axle trailer suitable for boats up to 18ft",
    dailyRate: 75,
    weekendRate: 150,
    weeklyRate: 375,
    available: true,
  },
  {
    id: "single-5000",
    type: "Single Axle",
    capacity: 5000,
    description: "Heavy duty single axle trailer suitable for boats up to 21ft",
    dailyRate: 95,
    weekendRate: 190,
    weeklyRate: 475,
    available: true,
  },
  {
    id: "tandem-7000",
    type: "Tandem Axle",
    capacity: 7000,
    description: "Tandem axle trailer suitable for boats up to 26ft",
    dailyRate: 125,
    weekendRate: 250,
    weeklyRate: 625,
    available: true,
  },
  {
    id: "tandem-10000",
    type: "Tandem Axle",
    capacity: 10000,
    description: "Heavy duty tandem axle trailer suitable for boats up to 30ft",
    dailyRate: 150,
    weekendRate: 300,
    weeklyRate: 750,
    available: true,
  },
]

// Mock trailer rentals
const trailerRentals = [
  {
    id: "TR-123456",
    trailerId: "single-3000",
    trailerType: "Single Axle (3000 lbs)",
    customer: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    startDate: "2023-05-15",
    endDate: "2023-05-17",
    status: "confirmed",
    totalPrice: 150,
  },
  {
    id: "TR-123457",
    trailerId: "single-5000",
    trailerType: "Single Axle (5000 lbs)",
    customer: "Emily Johnson",
    email: "emily@example.com",
    phone: "(555) 234-5678",
    startDate: "2023-05-16",
    endDate: "2023-05-23",
    status: "active",
    totalPrice: 475,
  },
]

// Get all trailers
router.get("/", (req, res) => {
  // Handle query parameters for availability check
  const { startDate, endDate } = req.query

  if (startDate && endDate) {
    // Check availability for the given date range
    const availableTrailers = trailers.map((trailer) => {
      // Check if there are any rentals for this trailer in the given date range
      const isRented = trailerRentals.some((rental) => {
        return (
          rental.trailerId === trailer.id &&
          rental.status !== "cancelled" &&
          ((rental.startDate <= String(startDate) && rental.endDate >= String(startDate)) ||
            (rental.startDate <= String(endDate) && rental.endDate >= String(endDate)) ||
            (rental.startDate >= String(startDate) && rental.endDate <= String(endDate)))
        )
      })

      return {
        ...trailer,
        available: !isRented,
      }
    })

    return res.status(200).json({
      success: true,
      startDate,
      endDate,
      data: availableTrailers,
    })
  }

  res.status(200).json({
    success: true,
    count: trailers.length,
    data: trailers,
  })
})

// Get trailer by ID
router.get("/:id", (req, res) => {
  const trailer = trailers.find((t) => t.id === req.params.id)

  if (!trailer) {
    return res.status(404).json({
      success: false,
      error: "Trailer not found",
    })
  }

  res.status(200).json({
    success: true,
    data: trailer,
  })
})

// Create trailer schema
const createTrailerSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
  capacity: z.number().positive({ message: "Capacity must be a positive number" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  dailyRate: z.number().positive({ message: "Daily rate must be a positive number" }),
  weekendRate: z.number().positive({ message: "Weekend rate must be a positive number" }),
  weeklyRate: z.number().positive({ message: "Weekly rate must be a positive number" }),
})

// Create trailer
router.post("/", authorize(["admin"]), validateRequest(createTrailerSchema), (req, res) => {
  const id = `${req.body.type.toLowerCase().replace(/\s+/g, "-")}-${req.body.capacity}`

  const newTrailer = {
    id,
    ...req.body,
    available: true,
  }

  trailers.push(newTrailer)

  res.status(201).json({
    success: true,
    data: newTrailer,
  })
})

// Update trailer schema
const updateTrailerSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }).optional(),
  capacity: z.number().positive({ message: "Capacity must be a positive number" }).optional(),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }).optional(),
  dailyRate: z.number().positive({ message: "Daily rate must be a positive number" }).optional(),
  weekendRate: z.number().positive({ message: "Weekend rate must be a positive number" }).optional(),
  weeklyRate: z.number().positive({ message: "Weekly rate must be a positive number" }).optional(),
  available: z.boolean().optional(),
})

// Update trailer
router.put("/:id", authorize(["admin"]), validateRequest(updateTrailerSchema), (req, res) => {
  const trailerIndex = trailers.findIndex((t) => t.id === req.params.id)

  if (trailerIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Trailer not found",
    })
  }

  trailers[trailerIndex] = {
    ...trailers[trailerIndex],
    ...req.body,
  }

  res.status(200).json({
    success: true,
    data: trailers[trailerIndex],
  })
})

// Delete trailer
router.delete("/:id", authorize(["admin"]), (req, res) => {
  const trailerIndex = trailers.findIndex((t) => t.id === req.params.id)

  if (trailerIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Trailer not found",
    })
  }

  // Check if there are any active rentals for this trailer
  const hasActiveRentals = trailerRentals.some(
    (rental) => rental.trailerId === req.params.id && ["confirmed", "active"].includes(rental.status),
  )

  if (hasActiveRentals) {
    return res.status(400).json({
      success: false,
      error: "Cannot delete trailer with active rentals",
    })
  }

  trailers = trailers.filter((t) => t.id !== req.params.id)

  res.status(200).json({
    success: true,
    data: {},
  })
})

// Trailer rental schema
const trailerRentalSchema = z.object({
  trailerId: z.string().min(1, { message: "Trailer ID is required" }),
  customer: z.string().min(2, { message: "Customer name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  driversLicense: z.string().min(1, { message: "Driver's license is required" }),
  towVehicle: z.string().min(1, { message: "Tow vehicle information is required" }),
  notes: z.string().optional(),
})

// Create trailer rental
router.post("/rentals", validateRequest(trailerRentalSchema), (req, res) => {
  const { trailerId, startDate, endDate } = req.body

  // Check if trailer exists
  const trailer = trailers.find((t) => t.id === trailerId)

  if (!trailer) {
    return res.status(404).json({
      success: false,
      error: "Trailer not found",
    })
  }

  // Check if trailer is available for the requested dates
  const isRented = trailerRentals.some((rental) => {
    return (
      rental.trailerId === trailerId &&
      rental.status !== "cancelled" &&
      ((rental.startDate <= startDate && rental.endDate >= startDate) ||
        (rental.startDate <= endDate && rental.endDate >= endDate) ||
        (rental.startDate >= startDate && rental.endDate <= endDate))
    )
  })

  if (isRented) {
    return res.status(400).json({
      success: false,
      error: "Trailer is not available for the requested dates",
    })
  }

  // Calculate total price (simplified calculation)
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  let totalPrice
  if (days <= 2) {
    totalPrice = trailer.weekendRate
  } else if (days <= 7) {
    totalPrice = trailer.dailyRate * days
  } else {
    totalPrice = trailer.weeklyRate * Math.ceil(days / 7)
  }

  const newRental = {
    id: `TR-${Date.now().toString().slice(-6)}`,
    trailerId,
    trailerType: `${trailer.type} (${trailer.capacity} lbs)`,
    ...req.body,
    status: "confirmed",
    totalPrice,
  }

  trailerRentals.push(newRental)

  res.status(201).json({
    success: true,
    data: newRental,
  })
})

// Get all trailer rentals
router.get("/rentals", authorize(["admin", "staff"]), (req, res) => {
  res.status(200).json({
    success: true,
    count: trailerRentals.length,
    data: trailerRentals,
  })
})

// Get trailer rental by ID
router.get("/rentals/:id", authorize(["admin", "staff"]), (req, res) => {
  const rental = trailerRentals.find((r) => r.id === req.params.id)

  if (!rental) {
    return res.status(404).json({
      success: false,
      error: "Trailer rental not found",
    })
  }

  res.status(200).json({
    success: true,
    data: rental,
  })
})

// Update trailer rental status
router.patch("/rentals/:id/status", authorize(["admin", "staff"]), (req, res) => {
  const { status } = req.body

  if (!["confirmed", "active", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({
      success: false,
      error: "Invalid status",
    })
  }

  const rentalIndex = trailerRentals.findIndex((r) => r.id === req.params.id)

  if (rentalIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Trailer rental not found",
    })
  }

  trailerRentals[rentalIndex].status = status

  res.status(200).json({
    success: true,
    data: trailerRentals[rentalIndex],
  })
})

export const trailersRouter = router
