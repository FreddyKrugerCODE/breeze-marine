"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Video, Calendar, User, Mail, Phone } from "lucide-react"
import { VideoCallDetailsDialog } from "@/components/admin/video-call-details-dialog"
import { useToast } from "@/components/ui/use-toast"

interface VideoCall {
  id: string
  date: string
  time: string
  purpose: string
  status: string
  meetingLink?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  notes?: string
}

export function VideoCallsList() {
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCall, setSelectedCall] = useState<VideoCall | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
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

  const handleViewDetails = (call: VideoCall) => {
    setSelectedCall(call)
    setIsDetailsOpen(true)
  }

  // Get upcoming calls (scheduled for today or in the future)
  const upcomingCalls = videoCalls
    .filter((call) => {
      const callDate = new Date(call.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return callDate >= today && call.status !== "completed" && call.status !== "cancelled"
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Video Calls</CardTitle>
        <Button size="sm">
          <Calendar className="mr-2 h-4 w-4" /> Schedule Call
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : upcomingCalls.length === 0 ? (
          <div className="text-center py-8">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming video calls scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingCalls.map((call) => (
              <div key={call.id} className="flex flex-col p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Video className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{call.purpose}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {new Date(call.date).toLocaleDateString()} at {call.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      call.status === "scheduled" ? "outline" : call.status === "in-progress" ? "default" : "secondary"
                    }
                    className={call.status === "in-progress" ? "bg-green-500" : ""}
                  >
                    {call.status.charAt(0).toUpperCase() + call.status.slice(1).replace("-", " ")}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{call.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{call.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{call.customerPhone}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <Button variant="outline" size="sm" disabled={!call.meetingLink}>
                    {call.meetingLink ? "Join Meeting" : "No Link Available"}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewDetails(call)}>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit call</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Add meeting link</DropdownMenuItem>
                      <DropdownMenuItem>Send reminder</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Cancel call</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {selectedCall && (
        <VideoCallDetailsDialog call={selectedCall} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      )}
    </Card>
  )
}
