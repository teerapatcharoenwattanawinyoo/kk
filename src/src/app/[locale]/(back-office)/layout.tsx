import { cookies } from 'next/headers'
import type React from 'react'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Footer, Header, Sidebar } from '@/shared'

export default async function BackOfficeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar />
      {/* Make Header a sibling of Sidebar so peer-data variants apply */}
      <Header />
      <SidebarInset className="flex min-h-screen min-w-0 flex-col overflow-x-hidden pt-12 sm:pt-14">
        <main className="bg-oc-muted-background w-full min-w-0 max-w-full flex-1 overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}
