import { NextResponse } from "next/server"

import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
  validateAdminCredentials,
} from "@/lib/admin-auth"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string
      password?: string
    }

    const email = body.email?.trim() ?? ""
    const password = body.password ?? ""

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    if (!validateAdminCredentials(email, password)) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const token = await createAdminSessionToken()
    const response = NextResponse.json({ success: true })
    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      token,
      adminSessionCookieOptions()
    )
    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
