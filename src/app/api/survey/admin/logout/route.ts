import { NextResponse } from "next/server"

import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
} from "@/lib/admin-auth"

export const runtime = "nodejs"

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...adminSessionCookieOptions(0),
    maxAge: 0,
  })
  return response
}
