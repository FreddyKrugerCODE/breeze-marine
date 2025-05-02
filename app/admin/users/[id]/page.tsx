"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPermissions } from "@/components/admin/user-permissions"
import { EditUserDialog } from "@/components/admin/edit-user-dialog"
import { ResetPasswordDialog } from "@/components/admin/reset-password-dialog"
import { ArrowLeft, UserCog, Key, Clock, Shield, UserX } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock user data - in a real app, this would be fetched from an API
const userData = {
  id: "user-1",
  name: "John Smith",
  email: "john@breezemarineservice.com",
  role: "admin",
  status: "active",
  lastLogin: "2023-05-10 09:45 AM",
  permissions: ["all"],
  avatar: "/placeholder.svg?height=40&width=40",
  createdAt: "2023-01-15",
  activityLog: [
    { action: "Login", timestamp: "2023-05-10 09:45 AM", ip: "192.168.1.1" },
    { action: "Updated boat listing", timestamp: "2023-05-10 10:30 AM", ip: "192.168.1.1" },
    { action: "Confirmed booking #B-123456", timestamp: "2023-05-10 11:15 AM", ip: "192.168.1.1" },
    { action: "Login", timestamp: "2023-05-09 08:30 AM", ip: "192.168.1.1" },
    { action: "Added new trailer", timestamp: "2023-05-09 10:45 AM", ip: "192.168.1.1" },
  ],
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user] = useState(userData) // In a real app, fetch user by ID
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)

  const handleDeactivateUser = async () => {
    setIsDeactivating(true)

    try {
      // In a real app, this would be an API call to deactivate the user
      console.log("Deactivating user:", user.id)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "User deactivated",
        description: `${user.name}'s account has been deactivated.`,
      })

      router.push("/admin/users")
    } catch (error) {
      toast({
        title: "Error deactivating user",
        description: "There was an error deactivating the user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeactivating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsResetPasswordOpen(true)}>
            <Key className="mr-2 h-4 w-4" /> Reset Password
          </Button>
          <Button onClick={() => setIsEditUserOpen(true)}>
            <UserCog className="mr-2 h-4 w-4" /> Edit User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>User information and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Badge
                variant={user.status === "active" ? "default" : "secondary"}
                className={user.status === "active" ? "bg-green-500" : ""}
              >
                {user.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Login</span>
                <span className="font-medium">{user.lastLogin}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Created</span>
                <span className="font-medium">{user.createdAt}</span>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <UserX className="mr-2 h-4 w-4" /> Deactivate User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will deactivate {user.name}'s account. They will no longer be able to log in or access the
                    system. This action can be reversed later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeactivateUser}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isDeactivating}
                  >
                    {isDeactivating ? "Deactivating..." : "Deactivate"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="permissions">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="permissions">
                <Shield className="mr-2 h-4 w-4" /> Permissions
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Clock className="mr-2 h-4 w-4" /> Activity Log
              </TabsTrigger>
            </TabsList>
            <TabsContent value="permissions" className="mt-6">
              <UserPermissions user={user} />
            </TabsContent>
            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Recent user activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {user.activityLog.map((activity, index) => (
                      <div key={index} className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                          </div>
                          {index < user.activityLog.length - 1 && <div className="w-px h-full bg-muted mt-2" />}
                        </div>
                        <div className="pb-8">
                          <div className="text-sm font-medium">{activity.action}</div>
                          <div className="text-sm text-muted-foreground">{activity.timestamp}</div>
                          <div className="text-xs text-muted-foreground mt-1">IP: {activity.ip}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <EditUserDialog user={user} open={isEditUserOpen} onOpenChange={setIsEditUserOpen} />
      <ResetPasswordDialog user={user} open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen} />
    </div>
  )
}
