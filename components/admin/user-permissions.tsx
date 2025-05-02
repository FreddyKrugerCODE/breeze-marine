"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, Save } from "lucide-react"

interface Permission {
  id: string
  name: string
  description: string
}

interface UserPermissionsProps {
  user: any
}

export function UserPermissions({ user }: UserPermissionsProps) {
  const [permissions, setPermissions] = useState<string[]>(user.permissions || [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availablePermissions: Permission[] = [
    {
      id: "bookings",
      name: "Bookings Management",
      description: "View and manage service bookings",
    },
    {
      id: "boats",
      name: "Boats Management",
      description: "Manage boat listings and inquiries",
    },
    {
      id: "trailers",
      name: "Trailers Management",
      description: "Manage trailer inventory and rentals",
    },
    {
      id: "video-calls",
      name: "Video Calls",
      description: "Access and manage video call appointments",
    },
    {
      id: "users",
      name: "User Management",
      description: "Manage user accounts and permissions",
    },
    {
      id: "settings",
      name: "Settings",
      description: "Access system settings and configuration",
    },
  ]

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setPermissions([...permissions, permissionId])
    } else {
      setPermissions(permissions.filter((id) => id !== permissionId))
    }
  }

  const handleSavePermissions = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to update the user's permissions
      console.log("Updating permissions for:", user.email, permissions)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Permissions updated",
        description: `${user.name}'s permissions have been updated.`,
      })
    } catch (error) {
      toast({
        title: "Error updating permissions",
        description: "There was an error updating permissions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isAdmin = user.role === "admin"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
          <Badge variant={isAdmin ? "default" : "outline"} className="capitalize">
            {user.role}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isAdmin ? (
          <div className="flex items-center gap-2 p-4 bg-muted rounded-md">
            <Shield className="h-5 w-5 text-primary" />
            <p className="text-sm">
              Admin users have full access to all features and cannot have individual permissions modified.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Permissions
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availablePermissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`permission-${permission.id}`}
                    checked={permissions.includes(permission.id) || permissions.includes("all")}
                    disabled={permissions.includes("all") || isAdmin}
                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={`permission-${permission.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.name}
                    </label>
                    <p className="text-sm text-muted-foreground">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      {!isAdmin && (
        <CardFooter className="flex justify-end">
          <Button onClick={handleSavePermissions} disabled={isSubmitting}>
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Permissions
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
