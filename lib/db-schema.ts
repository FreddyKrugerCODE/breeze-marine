// This file represents the database schema for the application
// In a real implementation, this would be used with an ORM like Prisma

// User model - for admin users of the system
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "staff"
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

// Service model - represents services offered
export interface Service {
  id: string
  name: string
  description: string
  category: string
  price: number | null // null means "Request Quote"
  duration: number // in minutes
  active: boolean
  createdAt: Date
  updatedAt: Date
}

// Booking model - for service bookings
export interface Booking {
  id: string
  serviceId: string
  date: Date
  timeSlot: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  customerName: string
  customerEmail: string
  customerPhone: string
  boatMake: string
  boatModel: string
  boatYear: string
  boatLength: string
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

// Boat model - for boats for sale
export interface Boat {
  id: string
  title: string
  make: string
  model: string
  year: number
  length: string
  price: number
  engine: string
  hours: number
  condition: string
  description: string
  features: string[] // Stored as JSON
  images: string[] // Array of image URLs
  status: "available" | "pending" | "sold"
  createdAt: Date
  updatedAt: Date
}

// Trailer model - for trailer rentals
export interface Trailer {
  id: string
  type: string
  capacity: number // in pounds
  description: string
  dailyRate: number
  weekendRate: number
  weeklyRate: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

// TrailerRental model - for trailer rental bookings
export interface TrailerRental {
  id: string
  trailerId: string
  startDate: Date
  endDate: Date
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
  customerName: string
  customerEmail: string
  customerPhone: string
  driversLicense: string
  towVehicle: string
  notes: string | null
  totalPrice: number
  createdAt: Date
  updatedAt: Date
}

// VideoCall model - for scheduled video calls
export interface VideoCall {
  id: string
  date: Date
  time: string
  purpose: string
  status: "scheduled" | "completed" | "cancelled"
  meetingLink: string
  customerName: string
  customerEmail: string
  customerPhone: string
  notes: string | null
  createdAt: Date
  updatedAt: Date
}
