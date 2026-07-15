import Link from "next/link"

import { AdminLogoutButton } from "@/components/admin-logout-button"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AnalyticsData, CountRow } from "@/lib/analytics"
import { labelFor, labelMaps } from "@/lib/label-maps"
import { cn } from "@/lib/utils"

function formatNumber(value: number, digits = 0) {
  if (!Number.isFinite(value)) return "0"
  return value.toLocaleString("en-IN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}

function DistributionCard({
  title,
  description,
  rows,
  labels,
  total,
}: {
  title: string
  description: string
  rows: CountRow[]
  labels?: Record<string, string>
  total: number
}) {
  const max = Math.max(...rows.map((r) => r.count), 1)

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        ) : (
          rows.map((row) => {
            const pct = total > 0 ? (row.count / total) * 100 : 0
            const width = (row.count / max) * 100
            return (
              <div key={row.key} className="space-y-1">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-neutral-800">
                    {labels ? labelFor(labels, row.key) : row.key}
                  </span>
                  <span className="shrink-0 text-neutral-500">
                    {row.count} ({formatNumber(pct, 1)}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-neutral-800"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      {hint ? (
        <CardContent>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </CardContent>
      ) : null}
    </Card>
  )
}

export function AdminDashboard({ data }: { data: AnalyticsData }) {
  const { totals, distributions, recent } = data

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <p className="text-sm text-neutral-500">Admin</p>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Survey Analytics
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Commute & Ride-Sharing Survey responses
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{totals.responses} total responses</Badge>
          <Link
            href="/survey/admin/respondents"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            All respondents
          </Link>
          <a
            href="/api/survey/admin/export"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Download CSV
          </a>
          <AdminLogoutButton />
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total responses"
          value={formatNumber(totals.responses)}
        />
        <StatCard
          label="Avg monthly fuel spend"
          value={`₹${formatNumber(totals.avgFuelSpend, 0)}`}
        />
        <StatCard
          label="Avg weekly distance"
          value={`${formatNumber(totals.avgWeeklyKm, 1)} km`}
        />
        <StatCard
          label="Avg accept-ride score"
          value={`${formatNumber(totals.avgAcceptLikelihood, 2)} / 5`}
          hint="Likelihood of accepting a shared ride"
        />
        <StatCard
          label="Avg offer-ride score"
          value={`${formatNumber(totals.avgOfferWillingness, 2)} / 5`}
          hint="Willingness to offer a ride"
        />
        <StatCard
          label="Would use trusted app"
          value={`${formatNumber(totals.willingToUseAppPct, 1)}%`}
          hint="Definitely Yes + Probably Yes"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DistributionCard
          title="Vehicle ownership"
          description="Q1 breakdown"
          rows={distributions.ownsVehicle}
          labels={labelMaps.ownsVehicle}
          total={totals.responses}
        />
        <DistributionCard
          title="Primary commute mode"
          description="Q2 breakdown"
          rows={distributions.primaryCommute}
          labels={labelMaps.primaryCommute}
          total={totals.responses}
        />
        <DistributionCard
          title="Ride sharing frequency"
          description="Q5 breakdown"
          rows={distributions.rideSharingFrequency}
          labels={labelMaps.rideSharingFrequency}
          total={totals.responses}
        />
        <DistributionCard
          title="Biggest concern"
          description="Q8 breakdown"
          rows={distributions.biggestConcern}
          labels={labelMaps.biggestConcern}
          total={totals.responses}
        />
        <DistributionCard
          title="Accept ride likelihood"
          description="Q6 scale (1–5)"
          rows={distributions.acceptRideLikelihood}
          labels={labelMaps.acceptRideLikelihood}
          total={totals.responses}
        />
        <DistributionCard
          title="Offer ride willingness"
          description="Q7 scale (1–5)"
          rows={distributions.offerRideWillingness}
          labels={labelMaps.offerRideWillingness}
          total={totals.responses}
        />
        <DistributionCard
          title="Expected monthly savings"
          description="Q9 breakdown"
          rows={distributions.monthlySavings}
          labels={labelMaps.monthlySavings}
          total={totals.responses}
        />
        <DistributionCard
          title="Trusted app intent"
          description="Q10 breakdown"
          rows={distributions.useTrustedApp}
          labels={labelMaps.useTrustedApp}
          total={totals.responses}
        />
        <DistributionCard
          title="Occupation"
          description="Optional field"
          rows={distributions.occupation}
          labels={labelMaps.occupation}
          total={totals.responses}
        />
        <DistributionCard
          title="City"
          description="Optional field"
          rows={distributions.city}
          total={totals.responses}
        />
      </section>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Recent responses</CardTitle>
            <CardDescription>Latest 50 submissions</CardDescription>
          </div>
          <Link
            href="/survey/admin/respondents"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            View all respondents
          </Link>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Commute</TableHead>
                <TableHead>Fuel / mo</TableHead>
                <TableHead>Km / wk</TableHead>
                <TableHead>Accept</TableHead>
                <TableHead>Offer</TableHead>
                <TableHead>App intent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-muted-foreground">
                    No responses yet.
                  </TableCell>
                </TableRow>
              ) : (
                recent.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Link
                        href={`/survey/admin/respondents/${row.respondent_no}`}
                        className="font-medium tabular-nums text-neutral-900 underline-offset-2 hover:underline"
                      >
                        {row.respondent_no}
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs">
                      {new Date(row.created_at).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>{row.name || "—"}</TableCell>
                    <TableCell>{row.city || "—"}</TableCell>
                    <TableCell>
                      {labelFor(labelMaps.primaryCommute, row.primary_commute)}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      ₹{formatNumber(Number(row.monthly_fuel_spend))}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {formatNumber(Number(row.weekly_km), 1)}
                    </TableCell>
                    <TableCell>{row.accept_ride_likelihood}</TableCell>
                    <TableCell>{row.offer_ride_willingness}</TableCell>
                    <TableCell>
                      {labelFor(labelMaps.useTrustedApp, row.use_trusted_app)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
