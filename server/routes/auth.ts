import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { z } from "zod"
import { validateRequest } from "../middleware/validate-request"

const router = express.Router()

// Mock user database - in a real app, this would be a database
const users = [
  {
    id: "user-1",
    name: "John Smith",
    email: "admin@breezemarineservice.com",
    password: "$2b$10$X7o4c5ywS4Nf.KU3TdgAVeHmkJvOgWy2LKiSJm/Kze5DspDEjCGPe", // password123
    role: "admin",
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "staff@breezemarineservice.com",
    password: "$2b$10$X7o4c5ywS4Nf.KU3TdgAVeHmkJvOgWy2LKiSJm/Kze5DspDEjCGPe", // password123
    role: "staff",
  },
]

// Login schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

// Login endpoint
router.post("/login", validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = users.find((u) => u.email === email)

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      })
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" },
    )

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      error: "Server error",
    })
  }
})

// Register schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

// Register endpoint (for customer registration)
router.post("/register", validateRequest(registerSchema), async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user (in a real app, this would be saved to a database)
    const newUser = {
      id: `user-${users.length + 1}`,
      name,
      email,
      password: hashedPassword,
      role: "customer", // Default role for self-registration
    }

    // Add user to mock database
    users.push(newUser)

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" },
    )

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      error: "Server error",
    })
  }
})

export const authRouter = router
