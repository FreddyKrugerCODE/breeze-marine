import express from "express"
import { z } from "zod"
import { validateRequest } from "../middleware/validate-request"
import { authorize } from "../middleware/auth-middleware"

const router = express.Router()

// Mock video calls data
let videoCalls = [
  {
    id: "VC-123456",
    customer: "Robert Smith",
    email: "robert@example.com",
    phone: "(555) 123-4567",
    purpose: "Boat Viewing",
    date: "2023-05-15",
    time: "11:30 AM",
    status: "scheduled",
    meetingLink: "https://whereby.com/breeze-marine-123456",
    notes: "Customer is interested in the Sea Ray 270",
    createdAt: "2023-05-10T09:45:00Z",
  },
  {
    id: "VC-123457",
    customer: "Emily Johnson",
    email: "emily@example.com",
    phone: "(555) 234-5678",
    purpose: "Service Consultation",
    date: "2023-05-16",
    time: "2:30 PM",
    status: "scheduled",
    meetingLink: "https://whereby.com/breeze-marine-123457",
    notes: "Customer needs advice on engine maintenance",
    createdAt: "2023-05-11T14:30:00Z",
  },
]

// Get all video calls
router.get("/", authorize(["admin", "staff"]), (req, res) => {
  res.status(200).json({
    success: true,
    count: videoCalls.length,
    data: videoCalls,
  })
})

// Get video call by ID
router.get("/:id", authorize(["admin", "staff"]), (req, res) => {
  const videoCall = videoCalls.find((v) => v.id === req.params.id)

  if (!videoCall) {
    return res.status(404).json({
      success: false,
      error: "Video call not found",
    })
  }

  res.status(200).json({
    success: true,
    data: videoCall,
  })
})

// Create video call schema
const createVideoCallSchema = z.object({
  customer: z.string().min(2, { message: "Customer name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  purpose: z.string().min(1, { message: "Purpose is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  notes: z.string().optional(),
})

// Create video call
router.post("/", validateRequest(createVideoCallSchema), (req, res) => {
  const id = `VC-${Date.now().toString().slice(-6)}`
  const meetingLink = `https://whereby.com/breeze-marine-${id.slice(3)}`

  const newVideoCall = {
    id,
    ...req.body,
    status: "scheduled",
    meetingLink,
    createdAt: new Date().toISOString(),
  }

  videoCalls.push(newVideoCall)

  res.status(201).json({
    success: true,
    data: newVideoCall,
  })
})

// Update video call schema
const updateVideoCallSchema = z.object({
  customer: z.string().min(2, { message: "Customer name must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }).optional(),
  purpose: z.string().min(1, { message: "Purpose is required" }).optional(),
  date: z.string().min(1, { message: "Date is required" }).optional(),
  time: z.string().min(1, { message: "Time is required" }).optional(),
  status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
  notes: z.string().optional(),
})

// Update video call
router.put("/:id", authorize(["admin", "staff"]), validateRequest(updateVideoCallSchema), (req, res) => {
  const videoCallIndex = videoCalls.findIndex((v) => v.id === req.params.id)

  if (videoCallIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Video call not found",
    })
  }

  videoCalls[videoCallIndex] = {
    ...videoCalls[videoCallIndex],
    ...req.body,
  }

  res.status(200).json({
    success: true,
    data: videoCalls[videoCallIndex],
  })
})

// Delete video call
router.delete("/:id", authorize(["admin"]), (req, res) => {
  const videoCallIndex = videoCalls.findIndex((v) => v.id === req.params.id)

  if (videoCallIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Video call not found",
    })
  }

  videoCalls = videoCalls.filter((v) => v.id !== req.params.id)

  res.status(200).json({
    success: true,
    data: {},
  })
})

// Get available time slots for a specific date
router.get("/available-slots/:date", (req, res) => {
  const date = req.params.date

  // Get all booked slots for the date
  const bookedSlots = videoCalls
    .filter((call) => call.date === date && call.status !== "cancelled")
    .map((call) => call.time)

  // All available time slots
  const allTimeSlots = ["9:30 AM", "10:30 AM", "11:30 AM", "1:30 PM", "2:30 PM", "3:30 PM"]

  // Filter out booked slots
  const availableSlots = allTimeSlots.filter((slot) => !bookedSlots.includes(slot))

  res.status(200).json({
    success: true,
    date,
    availableSlots,
  })
})

export const videoCallsRouter = router
