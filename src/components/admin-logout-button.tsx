"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export function AdminLogoutButton() {
  const router = useRouter()

  async function onLogout() {
    await fetch("/api/survey/admin/logout", { method: "POST" })
    router.replace("/survey/admin/login")
    router.refresh()
  }

  return (
    <Button type="button" variant="outline" onClick={onLogout}>
      Log out
    </Button>
  )
}
