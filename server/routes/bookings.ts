import express from "express"
import { z } from "zod"
import { validateRequest } from "../middleware/validate-request"
import { authorize } from "../middleware/auth-middleware"

const router = express.Router()

// Mock bookings data
let bookings = [
  {
    id: "B-123456",
    customer: "Michael Johnson",
    email: "michael@example.com",
    phone: "(555) 123-4567",
    service: "Engine Maintenance",
    date: "2023-05-15",
    time: "10:00 AM",
    status: "confirmed",
    boatDetails: {
      make: "Sea Ray",
      model: "270 Sundancer",
      year: "2018",
      length: "27 ft",
    },
    notes: "Customer requested a thorough inspection of the cooling system.",
    createdAt: "2023-05-10T09:45:00Z",
  },
  {
    id: "B-123457",
    customer: "Sarah Williams",
    email: "sarah@example.com",
    phone: "(555) 234-5678",
    service: "Hull Repairs",
    date: "2023-05-16",
    time: "2:00 PM",
    status: "pending",
    boatDetails: {
      make: "Boston Whaler",
      model: "210 Montauk",
      year: "2020",
      length: "21 ft",
    },
    notes: "Minor damage on starboard side near waterline.",
    createdAt: "2023-05-11T14:30:00Z",
  },
]

// Get all bookings
router.get("/", authorize(["admin", "staff"]), (req, res) => {
  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  })
})

// Get booking by ID
router.get("/:id", authorize(["admin", "staff"]), (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id)

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: "Booking not found",
    })
  }

  res.status(200).json({
    success: true,
    data: booking,
  })
})

// Create booking schema
const createBookingSchema = z.object({
  customer: z.string().min(2, { message: "Customer name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  service: z.string().min(1, { message: "Service is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  boatDetails: z.object({
    make: z.string().min(1, { message: "Boat make is required" }),
    model: z.string().min(1, { message: "Boat model is required" }),
    year: z.string().min(4, { message: "Boat year is required" }),
    length: z.string().min(1, { message: "Boat length is required" }),
  }),
  notes: z.string().optional(),
})

// Create booking
router.post("/", validateRequest(createBookingSchema), (req, res) => {
  const newBooking = {
    id: `B-${Date.now().toString().slice(-6)}`,
    ...req.body,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  bookings.push(newBooking)

  res.status(201).json({
    success: true,
    data: newBooking,
  })
})

// Update booking schema
const updateBookingSchema = z.object({
  customer: z.string().min(2, { message: "Customer name must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }).optional(),
  service: z.string().min(1, { message: "Service is required" }).optional(),
  date: z.string().min(1, { message: "Date is required" }).optional(),
  time: z.string().min(1, { message: "Time is required" }).optional(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
  boatDetails: z
    .object({
      make: z.string().min(1, { message: "Boat make is required" }).optional(),
      model: z.string().min(1, { message: "Boat model is required" }).optional(),
      year: z.string().min(4, { message: "Boat year is required" }).optional(),
      length: z.string().min(1, { message: "Boat length is required" }).optional(),
    })
    .optional(),
  notes: z.string().optional(),
})

// Update booking
router.put("/:id", authorize(["admin", "staff"]), validateRequest(updateBookingSchema), (req, res) => {
  const bookingIndex = bookings.findIndex((b) => b.id === req.params.id)

  if (bookingIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Booking not found",
    })
  }

  bookings[bookingIndex] = {
    ...bookings[bookingIndex],
    ...req.body,
  }

  res.status(200).json({
    success: true,
    data: bookings[bookingIndex],
  })
})

// Delete booking
router.delete("/:id", authorize(["admin"]), (req, res) => {
  const bookingIndex = bookings.findIndex((b) => b.id === req.params.id)

  if (bookingIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Booking not found",
    })
  }

  bookings = bookings.filter((b) => b.id !== req.params.id)

  res.status(200).json({
    success: true,
    data: {},
  })
})

export const bookingsRouter = router
