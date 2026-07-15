import { AdminDashboard } from "@/components/admin-dashboard"
import { getAnalytics } from "@/lib/analytics"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const data = await getAnalytics()

  return (
    <main className="min-h-full bg-neutral-50">
      <AdminDashboard data={data} />
    </main>
  )
}
