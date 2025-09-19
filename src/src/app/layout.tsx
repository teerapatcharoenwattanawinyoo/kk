import { ThemeProvider } from '@/components/theme-provider'
// import { Toaster as SonnerToaster } from "@/components/ui/sonner";
// import { Toaster } from "@/components/ui/toaster";
import { Toaster } from '@/components/ui/sonner'

import { I18nProvider } from '@/lib/i18n/provider'
import ReactQueryProvider from '@/lib/providers/react-query-provider'
import { UserProvider } from '@/lib/providers/user-provider'
import { getUser } from '@/lib/server/auth'
import '@/styles/globals.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import type React from 'react'
// Leaflet CSS will be imported in specific components that use it

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'OneCharge - EV Charging Dashboard',
  description: 'EV Charging Station Management Dashboard',
  generator: 'v0.dev',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUser()
  return (
    <html suppressHydrationWarning>
      <body
        className={`${kanit.className} antialiased`}
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          <I18nProvider>
            <UserProvider user={user}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </UserProvider>
          </I18nProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryProvider>
        <Toaster richColors />
      </body>
    </html>
  )
}
