import type { Locale } from '@/middleware'
import type React from 'react'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  return <div data-locale={locale}>{children}</div>
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return [{ locale: 'th' }, { locale: 'en' }, { locale: 'lo' }]
}
