import { NextResponse, type NextRequest } from "next/server"

import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin-auth"

const LOGIN_PATH = "/survey/admin/login"
const PUBLIC_PATHS = [LOGIN_PATH, "/api/survey/admin/login"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Old /admin URLs → /survey/admin
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const target = pathname.replace(/^\/admin/, "/survey/admin")
    return NextResponse.redirect(new URL(target, request.url))
  }

  if (PUBLIC_PATHS.some((path) => pathname === path)) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
    const isLoggedIn = await verifyAdminSessionToken(token)

    if (pathname === LOGIN_PATH && isLoggedIn) {
      return NextResponse.redirect(new URL("/survey/admin", request.url))
    }

    return NextResponse.next()
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const isLoggedIn = await verifyAdminSessionToken(token)

  if (isLoggedIn) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const loginUrl = new URL(LOGIN_PATH, request.url)
  loginUrl.searchParams.set("next", pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    "/survey/admin",
    "/survey/admin/:path*",
    "/api/survey/admin/:path*",
    "/admin",
    "/admin/:path*",
  ],
}
