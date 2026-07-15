import { listRespondents, responsesToCsv } from "@/lib/respondents"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const rows = await listRespondents()
    const csv = responsesToCsv(rows)
    const stamp = new Date().toISOString().slice(0, 10)

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="survay-responses-${stamp}.csv"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("CSV export error:", error)
    return Response.json({ error: "Failed to export CSV" }, { status: 500 })
  }
}
