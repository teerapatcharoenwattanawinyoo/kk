'use client'

import {
  getAssetPath,
  getLocaleFromPath,
  getLocalizedPath,
  removeLocaleFromPath,
} from '@/lib/utils/locale'
import type { Locale } from '@/middleware'
import { useParams, usePathname } from 'next/navigation'

/**
 * Hook for getting and working with the current locale
 */
export function useLocale() {
  const params = useParams()
  const pathname = usePathname()

  // Get locale from params (if using [locale] dynamic route)
  const locale =
    (params?.locale as Locale) || getLocaleFromPath(pathname) || 'en'

  /**
   * Create a localized version of a path
   * If the path already has a locale, it will be replaced with the target locale
   */
  const localizePath = (path: string, targetLocale?: Locale) => {
    const currentLocale = targetLocale || locale

    // If path already starts with current locale, return as is
    if (path.startsWith(`/${currentLocale}/`) || path === `/${currentLocale}`) {
      return path
    }

    return getLocalizedPath(path, currentLocale)
  }

  /**
   * Switch to a different locale while keeping the same path
   */
  const switchLocale = (newLocale: Locale) => {
    // Use utility function to properly remove locale prefix
    const currentPath = removeLocaleFromPath(pathname)
    return getLocalizedPath(currentPath, newLocale)
  }

  /**
   * Get asset path without locale prefix
   */
  const assetPath = (path: string) => {
    return getAssetPath(path)
  }

  return {
    locale,
    localizePath,
    switchLocale,
    assetPath,
    isThaiLocale: locale === 'th',
    isEnglishLocale: locale === 'en',
    isLaoLocale: locale === 'lo',
  }
}
