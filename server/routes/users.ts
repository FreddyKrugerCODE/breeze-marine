import express from "express"
import { z } from "zod"
import bcrypt from "bcrypt"
import { validateRequest } from "../middleware/validate-request"
import { authorize } from "../middleware/auth-middleware"

const router = express.Router()

// Mock users data
const users = [
  {
    id: "user-1",
    name: "John Smith",
    email: "admin@breezemarineservice.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-05-10 09:45 AM",
    permissions: ["all"],
    createdAt: "2023-01-15",
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah@breezemarineservice.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-05-12 11:30 AM",
    permissions: ["all"],
    createdAt: "2023-02-20",
  },
  {
    id: "user-3",
    name: "Michael Brown",
    email: "michael@breezemarineservice.com",
    role: "staff",
    status: "active",
    lastLogin: "2023-05-11 02:15 PM",
    permissions: ["bookings", "boats", "trailers"],
    createdAt: "2023-03-10",
  },
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily@breezemarineservice.com",
    role: "staff",
    status: "active",
    lastLogin: "2023-05-13 10:20 AM",
    permissions: ["bookings", "trailers"],
    createdAt: "2023-04-05",
  },
  {
    id: "user-5",
    name: "Robert Wilson",
    email: "robert@breezemarineservice.com",
    role: "staff",
    status: "inactive",
    lastLogin: "2023-04-28 03:45 PM",
    permissions: ["bookings"],
    createdAt: "2023-04-15",
  },
]

// Get all users
router.get("/", authorize(["admin"]), (req, res) => {
  // Don't send password hashes
  const safeUsers = users.map(({ password, ...user }) => user)

  res.status(200).json({
    success: true,
    count: safeUsers.length,
    data: safeUsers,
  })
})

// Get user by ID
router.get("/:id", authorize(["admin"]), (req, res) => {
  const user = users.find((u) => u.id === req.params.id)

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    })
  }

  // Don't send password hash
  const { password, ...safeUser } = user

  res.status(200).json({
    success: true,
    data: safeUser,
  })
})

// Create user schema
const createUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  role: z.enum(["admin", "staff"]),
  permissions: z.array(z.string()).optional(),
})

// Create user
router.post("/", authorize(["admin"]), validateRequest(createUserSchema), async (req, res) => {
  const { name, email, password, role, permissions } = req.body

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email)

  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: "User with this email already exists",
    })
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = {
    id: `user-${users.length + 1}`,
    name,
    email,
    password: hashedPassword,
    role,
    status: "active",
    lastLogin: "",
    permissions: role === "admin" ? ["all"] : permissions || [],
    createdAt: new Date().toISOString().split("T")[0],
  }

  users.push(newUser)

  // Don't send password hash in response
  const { password: _, ...safeUser } = newUser

  res.status(201).json({
    success: true,
    data: safeUser,
  })
})

// Update user schema
const updateUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  role: z.enum(["admin", "staff"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  permissions: z.array(z.string()).optional(),
})

// Update user
router.put("/:id", authorize(["admin"]), validateRequest(updateUserSchema), (req, res) => {
  const userIndex = users.findIndex((u) => u.id === req.params.id)

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    })
  }

  // Don't allow changing email to one that already exists
  if (req.body.email && req.body.email !== users[userIndex].email) {
    const emailExists = users.some((u) => u.email === req.body.email)
    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
      })
    }
  }

  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
  }

  // Don't send password hash in response
  const { password, ...safeUser } = users[userIndex]

  res.status(200).json({
    success: true,
    data: safeUser,
  })
})

// Change password schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
})

// Change password
router.post("/:id/change-password", authorize(["admin"]), validateRequest(changePasswordSchema), async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const userIndex = users.findIndex((u) => u.id === req.params.id)

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    })
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, users[userIndex].password || "")

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: "Current password is incorrect",
    })
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  // Update password
  users[userIndex].password = hashedPassword

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  })
})

// Reset password schema
const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
})

// Reset password (admin only)
router.post("/:id/reset-password", authorize(["admin"]), validateRequest(resetPasswordSchema), async (req, res) => {
  const { newPassword } = req.body
  const userIndex = users.findIndex((u) => u.id === req.params.id)

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    })
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  // Update password
  users[userIndex].password = hashedPassword

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  })
})

// Delete user
router.delete("/:id", authorize(["admin"]), (req, res) => {
  const userIndex = users.findIndex((u) => u.id === req.params.id)

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    })
  }

  // Don't allow deleting the last admin
  const adminCount = users.filter((u) => u.role === "admin").length
  if (users[userIndex].role === "admin" && adminCount <= 1) {
    return res.status(400).json({
      success: false,
      error: "Cannot delete the last admin user",
    })
  }

  // Remove user from array
  const filteredUsers = users.filter((u) => u.id !== req.params.id)

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  })
})

export const usersRouter = router
