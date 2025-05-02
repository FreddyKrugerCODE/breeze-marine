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
}

interface TrailerRental {
  id: string
  trailerId: string
  trailerType: string
  customer: string
  startDate: string
  endDate: string
  status: string
}

interface TrailerRentalCalendarProps {
  rentals: TrailerRental[]
  trailers: Trailer[]
}

export function TrailerRentalCalendar({ rentals, trailers }: TrailerRentalCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Get rentals for the selected date
  const selectedDateRentals = rentals.filter((rental) => {
    if (!date) return false
    const startDate = new Date(rental.startDate)
    const endDate = new Date(rental.endDate)
    const selectedDate = new Date(date)

    // Reset time part for comparison
    selectedDate.setHours(0, 0, 0, 0)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)

    return selectedDate >= startDate && selectedDate <= endDate
  })

  // Function to get dates with rentals for highlighting in the calendar
  const getDatesWithRentals = () => {
    const dates = new Set<number>()
    rentals.forEach((rental) => {
      const startDate = new Date(rental.startDate)
      const endDate = new Date(rental.endDate)

      // Add all dates between start and end
      const currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        dates.add(new Date(currentDate).setHours(0, 0, 0, 0))
        currentDate.setDate(currentDate.getDate() + 1)
      }
    })
    return dates
  }

  const datesWithRentals = getDatesWithRentals()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            booked: (date) => datesWithRentals.has(date.setHours(0, 0, 0, 0)),
          }}
          modifiersStyles={{
            booked: { fontWeight: "bold", backgroundColor: "rgba(var(--primary), 0.1)" },
          }}
        />
      </div>
      <div>
        <h3 className="font-medium mb-4">{date ? format(date, "MMMM d, yyyy") : "Select a date"}</h3>
        {selectedDateRentals.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No trailer rentals for this date</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {selectedDateRentals.map((rental) => (
              <Card key={rental.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{rental.trailerType}</div>
                      <div className="text-sm text-muted-foreground">{rental.customer}</div>
                      <div className="text-sm mt-1">
                        {new Date(rental.startDate).toLocaleDateString()} -{" "}
                        {new Date(rental.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge
                      variant={
                        rental.status === "active" ? "default" : rental.status === "confirmed" ? "outline" : "secondary"
                      }
                      className={rental.status === "active" ? "bg-green-500" : ""}
                    >
                      {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                    </Badge>
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
