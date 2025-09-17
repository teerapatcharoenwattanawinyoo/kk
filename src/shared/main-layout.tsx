'use client'

import type React from 'react'

import { Footer, Header, Sidebar } from '@/components/back-office/layouts'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar />
      {/* Make Header a sibling of Sidebar so peer-data variants apply */}
      <Header />
      <SidebarInset className="flex min-h-screen min-w-0 flex-col overflow-x-hidden pt-12 sm:pt-14">
        <main className="bg-mute-background w-full min-w-0 max-w-full flex-1 overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}
