import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth"
import bookingsRoutes from "./routes/bookings"
import boatsRoutes from "./routes/boats"
import trailersRoutes from "./routes/trailers"
import videoCallsRoutes from "./routes/video-calls"
import usersRoutes from "./routes/users"
import paymentsRoutes from "./routes/payments"
import { errorHandler } from "./middleware/error-handler"
import { logger } from "./middleware/logger"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(logger)

// Special handling for Stripe webhooks (raw body)
app.use("/api/payments/webhook", express.raw({ type: "application/json" }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/bookings", bookingsRoutes)
app.use("/api/boats", boatsRoutes)
app.use("/api/trailers", trailersRoutes)
app.use("/api/video-calls", videoCallsRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/payments", paymentsRoutes)

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
