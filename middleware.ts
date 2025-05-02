import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isAdminPath = path.startsWith("/admin")
  const isLoginPath = path === "/admin/login"

  // Get token from cookie
  const token = request.cookies.get("admin_session")?.value

  // If trying to access admin pages without being logged in
  if (isAdminPath && !isLoginPath && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // If already logged in and trying to access login page
  if (isLoginPath && token) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
