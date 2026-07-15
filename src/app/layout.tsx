import type { Metadata } from "next"
import { Source_Serif_4 } from "next/font/google"

import "./globals.css"

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Commute & Ride-Sharing Survey",
  description: "Commute aur Ride-Sharing Survey",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sourceSerif.variable} h-full antialiased`}>
      <body className="min-h-full font-[family-name:var(--font-serif)] text-neutral-900">
        {children}
      </body>
    </html>
  )
}
