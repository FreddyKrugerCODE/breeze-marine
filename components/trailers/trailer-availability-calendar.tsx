"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface Trailer {
  id: string
  type: string
  capacity: number
  description: string
  dailyRate: number
  weekendRate: number
  weeklyRate: number
  active: boolean
}

interface TrailerAvailabilityCalendarProps {
  trailers: Trailer[]
}

export function TrailerAvailabilityCalendar({ trailers }: TrailerAvailabilityCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [availableTrailers, setAvailableTrailers] = useState<Trailer[]>(trailers)
  const [loading, setLoading] = useState(false)

  // Function to check trailer availability for the selected date
  const checkAvailability = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return

    setLoading(true)
    try {
      // In a real application, this would be an API call to check availability
      // For now, we'll simulate a response with random availability
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simulate random availability
      const available = trailers.filter(() => Math.random() > 0.3)
      setAvailableTrailers(available)
    } catch (error) {
      console.error("Error checking availability:", error)
    } finally {
      setLoading(false)
    }
  }

  // Check availability when date changes
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      checkAvailability(newDate)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          className="rounded-md border"
          disabled={(date) => date < new Date()}
        />
      </div>
      <div>
        <h3 className="font-medium mb-4">
          {date ? `Available Trailers for ${format(date, "MMMM d, yyyy")}` : "Select a date"}
        </h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !date ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Please select a date to check availability</p>
            </CardContent>
          </Card>
        ) : availableTrailers.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No trailers available for this date</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {availableTrailers.map((trailer) => (
              <Card key={trailer.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{trailer.type}</div>
                      <div className="text-sm text-muted-foreground">{trailer.capacity} lbs capacity</div>
                      <div className="text-sm mt-1">{trailer.description}</div>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      Available
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Daily:</span>
                      <span className="ml-1 font-medium">${trailer.dailyRate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Weekend:</span>
                      <span className="ml-1 font-medium">${trailer.weekendRate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Weekly:</span>
                      <span className="ml-1 font-medium">${trailer.weeklyRate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
