"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AddTrailerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    type: "Single Axle",
    capacity: "",
    description: "",
    dailyRate: "",
    weekendRate: "",
    weeklyRate: "",
    active: true,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real application, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Trailer added",
        description: "The trailer has been added successfully.",
      })

      router.push("/admin/trailers")
    } catch (error) {
      console.error("Error adding trailer:", error)
      toast({
        title: "Error",
        description: "Failed to add trailer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add Trailer</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trailer Details</CardTitle>
          <CardDescription>Add a new trailer to your rental inventory.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Trailer Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange("type", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trailer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single Axle">Single Axle</SelectItem>
                    <SelectItem value="Tandem Axle">Tandem Axle</SelectItem>
                    <SelectItem value="Triple Axle">Triple Axle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (lbs)</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1000"
                  step="500"
                  value={formData.capacity}
                  onChange={(e) => handleChange("capacity", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Detailed description of the trailer"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dailyRate">Daily Rate ($)</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.dailyRate}
                  onChange={(e) => handleChange("dailyRate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weekendRate">Weekend Rate ($)</Label>
                <Input
                  id="weekendRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.weekendRate}
                  onChange={(e) => handleChange("weekendRate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeklyRate">Weekly Rate ($)</Label>
                <Input
                  id="weeklyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.weeklyRate}
                  onChange={(e) => handleChange("weeklyRate", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleChange("active", checked)}
              />
              <Label htmlFor="active">Active (available for rental)</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Trailer"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
