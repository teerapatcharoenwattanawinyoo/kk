import { AuthLayout } from '@/app/[locale]/(auth)/_components'
import type React from 'react'

export default function AuthPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthLayout>{children}</AuthLayout>
}
