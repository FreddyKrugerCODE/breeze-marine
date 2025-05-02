import { toast } from "@/components/ui/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Helper function to handle API responses
async function handleResponse(response: Response) {
  const data = await response.json()

  if (!response.ok) {
    const error = data.error || "Something went wrong"
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    })
    throw new Error(error)
  }

  return data
}

// Helper function to make API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    // Get token from localStorage (in a real app, you might use a more secure method)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    // Set default headers
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    return await handleResponse(response)
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    // Save token to localStorage
    if (data.token) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
    }

    return data
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/admin/login"
  },

  getCurrentUser: () => {
    const user = typeof window !== "undefined" ? localStorage.getItem("user") : null
    return user ? JSON.parse(user) : null
  },

  isAuthenticated: () => {
    return typeof window !== "undefined" && !!localStorage.getItem("token")
  },
}

// Booking services
export const bookingService = {
  getBookings: () => apiRequest("/bookings"),
  getBooking: (id: string) => apiRequest(`/bookings/${id}`),
  createBooking: (booking: any) =>
    apiRequest("/bookings", {
      method: "POST",
      body: JSON.stringify(booking),
    }),
  updateBooking: (id: string, booking: any) =>
    apiRequest(`/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify(booking),
    }),
  deleteBooking: (id: string) =>
    apiRequest(`/bookings/${id}`, {
      method: "DELETE",
    }),
}

// Boat services
export const boatService = {
  getBoats: (filters = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value))
    })
    return apiRequest(`/boats?${queryParams.toString()}`)
  },
  getBoat: (id: string) => apiRequest(`/boats/${id}`),
  createBoat: (boat: any) =>
    apiRequest("/boats", {
      method: "POST",
      body: JSON.stringify(boat),
    }),
  updateBoat: (id: string, boat: any) =>
    apiRequest(`/boats/${id}`, {
      method: "PUT",
      body: JSON.stringify(boat),
    }),
  deleteBoat: (id: string) =>
    apiRequest(`/boats/${id}`, {
      method: "DELETE",
    }),
}

// Trailer services
export const trailerService = {
  getTrailers: (startDate?: string, endDate?: string) => {
    let endpoint = "/trailers"
    if (startDate && endDate) {
      endpoint += `?startDate=${startDate}&endDate=${endDate}`
    }
    return apiRequest(endpoint)
  },
  getTrailer: (id: string) => apiRequest(`/trailers/${id}`),
  createTrailer: (trailer: any) =>
    apiRequest("/trailers", {
      method: "POST",
      body: JSON.stringify(trailer),
    }),
  updateTrailer: (id: string, trailer: any) =>
    apiRequest(`/trailers/${id}`, {
      method: "PUT",
      body: JSON.stringify(trailer),
    }),
  deleteTrailer: (id: string) =>
    apiRequest(`/trailers/${id}`, {
      method: "DELETE",
    }),
  getRentals: () => apiRequest("/trailers/rentals"),
  getRental: (id: string) => apiRequest(`/trailers/rentals/${id}`),
  createRental: (rental: any) =>
    apiRequest("/trailers/rentals", {
      method: "POST",
      body: JSON.stringify(rental),
    }),
  updateRentalStatus: (id: string, status: string) =>
    apiRequest(`/trailers/rentals/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
}

// Video call services
export const videoCallService = {
  getVideoCalls: () => apiRequest("/video-calls"),
  getVideoCall: (id: string) => apiRequest(`/video-calls/${id}`),
  createVideoCall: (videoCall: any) =>
    apiRequest("/video-calls", {
      method: "POST",
      body: JSON.stringify(videoCall),
    }),
  updateVideoCall: (id: string, videoCall: any) =>
    apiRequest(`/video-calls/${id}`, {
      method: "PUT",
      body: JSON.stringify(videoCall),
    }),
  deleteVideoCall: (id: string) =>
    apiRequest(`/video-calls/${id}`, {
      method: "DELETE",
    }),
  getAvailableSlots: (date: string) => apiRequest(`/video-calls/available-slots/${date}`),
}

// User services
export const userService = {
  getUsers: () => apiRequest("/users"),
  getUser: (id: string) => apiRequest(`/users/${id}`),
  createUser: (user: any) =>
    apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(user),
    }),
  updateUser: (id: string, user: any) =>
    apiRequest(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    }),
  deleteUser: (id: string) =>
    apiRequest(`/users/${id}`, {
      method: "DELETE",
    }),
  changePassword: (id: string, currentPassword: string, newPassword: string) =>
    apiRequest(`/users/${id}/change-password`, {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  resetPassword: (id: string, newPassword: string) =>
    apiRequest(`/users/${id}/reset-password`, {
      method: "POST",
      body: JSON.stringify({ newPassword }),
    }),
}

// Fetch boats with filters
export const getBoats = async (filters: Record<string, string> = {}) => {
  try {
    // Convert filters object to query string
    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value)
      }
    })

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boats${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch boats")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching boats:", error)
    throw error
  }
}

// Fetch a single boat by ID
export const getBoatById = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boats/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch boat")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching boat:", error)
    throw error
  }
}

// Create a new boat
export const createBoat = async (boatData: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(boatData),
    })

    if (!response.ok) {
      throw new Error("Failed to create boat")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating boat:", error)
    throw error
  }
}

// Update a boat
export const updateBoat = async (id: string, boatData: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boats/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(boatData),
    })

    if (!response.ok) {
      throw new Error("Failed to update boat")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating boat:", error)
    throw error
  }
}

// Delete a boat
export const deleteBoat = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boats/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete boat")
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting boat:", error)
    throw error
  }
}
