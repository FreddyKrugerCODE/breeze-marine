import express from "express"
import cors from "cors"
import dotenv from "dotenv"
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

// Import routes safely
try {
  const authRouter = require("./routes/auth").default || require("./routes/auth").authRouter
  if (authRouter) app.use("/api/auth", authRouter)
  else console.error("Auth router is undefined")
} catch (error) {
  console.error("Failed to load auth routes:", error)
}

try {
  const bookingsRouter = require("./routes/bookings").default || require("./routes/bookings").bookingsRouter
  if (bookingsRouter) app.use("/api/bookings", bookingsRouter)
  else console.error("Bookings router is undefined")
} catch (error) {
  console.error("Failed to load bookings routes:", error)
}

try {
  const boatsRouter = require("./routes/boats").default || require("./routes/boats")
  if (boatsRouter) app.use("/api/boats", boatsRouter)
  else console.error("Boats router is undefined")
} catch (error) {
  console.error("Failed to load boats routes:", error)
}

try {
  const trailersRouter = require("./routes/trailers").default || require("./routes/trailers").trailersRouter
  if (trailersRouter) app.use("/api/trailers", trailersRouter)
  else console.error("Trailers router is undefined")
} catch (error) {
  console.error("Failed to load trailers routes:", error)
}

try {
  const videoCallsRouter = require("./routes/video-calls").default || require("./routes/video-calls").videoCallsRouter
  if (videoCallsRouter) app.use("/api/video-calls", videoCallsRouter)
  else console.error("Video calls router is undefined")
} catch (error) {
  console.error("Failed to load video calls routes:", error)
}

try {
  const usersRouter = require("./routes/users").default || require("./routes/users").usersRouter
  if (usersRouter) app.use("/api/users", usersRouter)
  else console.error("Users router is undefined")
} catch (error) {
  console.error("Failed to load users routes:", error)
}

try {
  const paymentsRouter = require("./routes/payments").default || require("./routes/payments")
  if (paymentsRouter) app.use("/api/payments", paymentsRouter)
  else console.error("Payments router is undefined")
} catch (error) {
  console.error("Failed to load payments routes:", error)
}

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Breeze Marine API is running")
})

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app