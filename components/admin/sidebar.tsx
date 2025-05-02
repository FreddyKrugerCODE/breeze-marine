"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, Ship, Truck, Video, Users, Settings, LogOut, Anchor, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInput,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["admin", "staff"],
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: <Calendar className="h-5 w-5" />,
    roles: ["admin", "staff"],
  },
  {
    title: "Boats",
    href: "/admin/boats",
    icon: <Ship className="h-5 w-5" />,
    roles: ["admin", "staff"],
  },
  {
    title: "Trailers",
    href: "/admin/trailers",
    icon: <Truck className="h-5 w-5" />,
    roles: ["admin", "staff"],
  },
  {
    title: "Video Calls",
    href: "/admin/video-calls",
    icon: <Video className="h-5 w-5" />,
    roles: ["admin", "staff"],
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
    roles: ["admin"],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [role, setRole] = useState(user?.role || "admin")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNavItems = navItems
    .filter((item) => item.roles.includes(role))
    .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-4">
          <Anchor className="h-6 w-6 text-cyan-600" />
          <span className="font-bold text-lg">Breeze Marine</span>
        </div>
        <div className="px-4 pb-2">
          <div className="relative">
            <SidebarInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <Label htmlFor="role-select" className="text-xs text-muted-foreground mb-1 block">
            Switch Role (Demo)
          </Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role-select" className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
