import { Suspense } from "react"

import { AdminLoginForm } from "@/components/admin-login-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-full items-center justify-center bg-neutral-100 px-4 py-10">
      <Card className="w-full max-w-md shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Admin login</CardTitle>
          <CardDescription>
            Sign in to view survey analytics and responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-sm text-neutral-500">Loading...</p>}>
            <AdminLoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}
