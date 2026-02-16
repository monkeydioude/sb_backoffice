"use client"

import { Sidebar } from "./sidebar"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  )
}
