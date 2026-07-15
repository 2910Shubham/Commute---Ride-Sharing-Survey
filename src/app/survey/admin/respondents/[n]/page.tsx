import Link from "next/link"
import { notFound } from "next/navigation"

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
  getRespondentByNumber,
  getRespondentCount,
  respondentToAnswerRows,
} from "@/lib/respondents"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ n: string }>
}

export default async function RespondentDetailPage({ params }: PageProps) {
  const { n } = await params
  const respondentNo = Number(n)

  if (!Number.isInteger(respondentNo) || respondentNo < 1) {
    notFound()
  }

  const [response, total] = await Promise.all([
    getRespondentByNumber(respondentNo),
    getRespondentCount(),
  ])

  if (!response) {
    notFound()
  }

  const answers = respondentToAnswerRows(response)
  const prev = respondentNo > 1 ? respondentNo - 1 : null
  const next = respondentNo < total ? respondentNo + 1 : null

  return (
    <main className="min-h-full bg-neutral-50">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        <header className="space-y-3 border-b border-neutral-200 pb-4">
          <p className="text-sm text-neutral-500">
            <Link href="/survey/admin" className="hover:underline">
              Admin
            </Link>{" "}
            /{" "}
            <Link href="/survey/admin/respondents" className="hover:underline">
              Respondents
            </Link>{" "}
            / #{respondentNo}
          </p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Respondent {respondentNo}
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                Full answers including write-in text fields
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {respondentNo} of {total}
              </Badge>
              <AdminLogoutButton />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/survey/admin/respondents"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Back to list
            </Link>
            {prev ? (
              <Link
                href={`/survey/admin/respondents/${prev}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Previous
              </Link>
            ) : null}
            {next ? (
              <Link
                href={`/survey/admin/respondents/${next}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Next
              </Link>
            ) : null}
          </div>
        </header>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">
              {response.name?.trim() || `Respondent ${respondentNo}`}
            </CardTitle>
            <CardDescription>
              Submitted {new Date(response.created_at).toLocaleString("en-IN")}
              {response.city ? ` · ${response.city}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-neutral-200">
              {answers.map((item) => (
                <div
                  key={item.question}
                  className="grid gap-1 py-3 sm:grid-cols-[220px_1fr] sm:gap-4"
                >
                  <dt className="text-sm font-medium text-neutral-700">
                    {item.question}
                  </dt>
                  <dd className="text-sm whitespace-pre-wrap text-neutral-900">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
