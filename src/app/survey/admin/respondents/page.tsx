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
import { labelFor, labelMaps } from "@/lib/label-maps"
import { listRespondents } from "@/lib/respondents"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function RespondentsPage() {
  const respondents = await listRespondents()

  return (
    <main className="min-h-full bg-neutral-50">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-3 border-b border-neutral-200 pb-4">
          <div>
            <p className="text-sm text-neutral-500">
              <Link href="/survey/admin" className="hover:underline">
                Admin
              </Link>{" "}
              / Respondents
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
              All respondents
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Click a respondent to see every answer, including text fields.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{respondents.length} respondents</Badge>
            <a
              href="/api/survey/admin/export"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Download CSV
            </a>
            <AdminLogoutButton />
          </div>
        </header>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Respondent list</CardTitle>
            <CardDescription>
              Numbered in submission order (Respondent 1 = earliest)
            </CardDescription>
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
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {respondents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground">
                      No respondents yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  respondents.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium tabular-nums">
                        {row.respondent_no}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs">
                        {new Date(row.created_at).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>{row.name || "—"}</TableCell>
                      <TableCell>{row.city || "—"}</TableCell>
                      <TableCell>
                        {labelFor(labelMaps.primaryCommute, row.primary_commute)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/survey/admin/respondents/${row.respondent_no}`}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" })
                          )}
                        >
                          View answers
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
