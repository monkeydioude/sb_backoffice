import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/providers/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Spendbaker Backoffice",
  description: "Backoffice de gestion Spendbaker",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
