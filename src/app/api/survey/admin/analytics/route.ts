import { NextResponse } from "next/server"

import { getAnalytics } from "@/lib/analytics"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const data = await getAnalytics()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Admin analytics error:", error)
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    )
  }
}
