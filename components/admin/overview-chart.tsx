"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

// Mock data for the chart
const data = [
  { name: "May 1", bookings: 4, revenue: 450 },
  { name: "May 2", bookings: 3, revenue: 380 },
  { name: "May 3", bookings: 5, revenue: 620 },
  { name: "May 4", bookings: 7, revenue: 890 },
  { name: "May 5", bookings: 2, revenue: 250 },
  { name: "May 6", bookings: 6, revenue: 740 },
  { name: "May 7", bookings: 8, revenue: 950 },
  { name: "May 8", bookings: 9, revenue: 1100 },
  { name: "May 9", bookings: 5, revenue: 680 },
  { name: "May 10", bookings: 4, revenue: 520 },
  { name: "May 11", bookings: 6, revenue: 810 },
  { name: "May 12", bookings: 7, revenue: 920 },
  { name: "May 13", bookings: 3, revenue: 400 },
  { name: "May 14", bookings: 4, revenue: 550 },
]

export function OverviewChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.split(" ")[1]}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="bookings" name="Bookings" fill="#0891b2" radius={[4, 4, 0, 0]} />
        <Bar dataKey="revenue" name="Revenue ($)" fill="#0e7490" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
