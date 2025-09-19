'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { detectDefaultLocale, initI18n, useI18n, type Locale } from './index'

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

interface I18nProviderProps {
  children: ReactNode
  defaultLocale?: Locale
}

export function I18nProvider({ children, defaultLocale }: I18nProviderProps) {
  const { locale, setLocale, t } = useI18n()

  useEffect(() => {
    const initLocale = defaultLocale || detectDefaultLocale()
    initI18n(initLocale).catch(console.error)
  }, [defaultLocale])

  const value: I18nContextValue = {
    locale,
    setLocale,
    t,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// Hook สำหรับใช้งาน I18n context
export function useI18nContext() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18nContext must be used within an I18nProvider')
  }
  return context
}
