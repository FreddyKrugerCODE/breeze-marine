import { z } from "zod"

// Define the boat schema using Zod
export const boatSchema = z.object({
  id: z.string(),
  title: z.string(),
  make: z.string(),
  model: z.string(),
  year: z.number(),
  length: z.string(),
  price: z.number(),
  engine: z.string(),
  hours: z.number(),
  condition: z.string(),
  description: z.string(),
  features: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  status: z.enum(["available", "pending", "sold"]).default("available"),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional(),
})

// Create a type from the schema
export type BoatSchemaType = z.infer<typeof boatSchema>

// Partial schema for updates
export const boatUpdateSchema = boatSchema.partial()

// Schema for creating a new boat (id is optional as it might be generated)
export const boatCreateSchema = boatSchema.omit({ id: true, createdAt: true, updatedAt: true }).extend({
  id: z.string().optional(),
})

// Function to validate boat data
export function validateBoat(data: unknown) {
  try {
    return { boat: boatSchema.parse(data), success: true, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { boat: null, success: false, error: error.format() }
    }
    return { boat: null, success: false, error }
  }
}

// Function to validate partial boat data for updates
export function validateBoatUpdate(data: unknown) {
  try {
    return { boat: boatUpdateSchema.parse(data), success: true, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { boat: null, success: false, error: error.format() }
    }
    return { boat: null, success: false, error }
  }
}

// Function to validate boat creation data
export function validateBoatCreate(data: unknown) {
  try {
    return { boat: boatCreateSchema.parse(data), success: true, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { boat: null, success: false, error: error.format() }
    }
    return { boat: null, success: false, error }
  }
}
