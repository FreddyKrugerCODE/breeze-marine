"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Video, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface VideoCall {
  id: string
  date: string
  time: string
  purpose: string
  status: string
  customerName: string
}

export function VideoCallCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchVideoCalls = async () => {
      try {
        const response = await fetch("/api/video-calls")
        if (!response.ok) {
          throw new Error("Failed to fetch video calls")
        }
        const data = await response.json()
        setVideoCalls(data)
      } catch (error) {
        console.error("Error fetching video calls:", error)
        toast({
          title: "Error",
          description: "Failed to load video calls. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVideoCalls()
  }, [toast])

  // Get calls for the selected date
  const selectedDateCalls = videoCalls.filter((call) => {
    if (!date) return false
    const callDate = new Date(call.date)
    return (
      callDate.getDate() === date.getDate() &&
      callDate.getMonth() === date.getMonth() &&
      callDate.getFullYear() === date.getFullYear()
    )
  })

  // Function to get dates with calls for highlighting in the calendar
  const getDatesWithCalls = () => {
    const dates = new Set<number>()
    videoCalls.forEach((call) => {
      const callDate = new Date(call.date).getTime()
      dates.add(callDate)
    })
    return dates
  }

  const datesWithCalls = getDatesWithCalls()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Video Call Calendar</CardTitle>
            <CardDescription>Schedule and manage video consultations</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Schedule Call
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  booked: (date) => datesWithCalls.has(date.getTime()),
                }}
                modifiersStyles={{
                  booked: { fontWeight: "bold", backgroundColor: "rgba(var(--primary), 0.1)" },
                }}
              />
            </div>
            <div>
              <h3 className="font-medium mb-4">{date ? format(date, "MMMM d, yyyy") : "Select a date"}</h3>
              {selectedDateCalls.length === 0 ? (
                <div className="text-center py-8 border rounded-md">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No video calls scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateCalls.map((call) => (
                    <div key={call.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <div className="font-medium">{call.time}</div>
                        <div className="text-sm text-muted-foreground">{call.customerName}</div>
                        <div className="text-sm">{call.purpose}</div>
                      </div>
                      <Badge
                        variant={
                          call.status === "scheduled"
                            ? "outline"
                            : call.status === "in-progress"
                              ? "default"
                              : "secondary"
                        }
                        className={call.status === "in-progress" ? "bg-green-500" : ""}
                      >
                        {call.status.charAt(0).toUpperCase() + call.status.slice(1).replace("-", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
