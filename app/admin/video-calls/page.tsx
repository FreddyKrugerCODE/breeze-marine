import type { Metadata } from "next"
import { VideoCallsList } from "@/components/admin/video-calls-list"
import { VideoCallCalendar } from "@/components/admin/video-call-calendar"

export const metadata: Metadata = {
  title: "Video Calls | Breeze Marine Admin",
  description: "Manage video consultations with customers",
}

export default function VideoCallsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Video Calls</h1>
        <p className="text-muted-foreground">
          Manage video consultations with customers for remote diagnostics and support.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <VideoCallCalendar />
        <VideoCallsList />
      </div>
    </div>
  )
}
