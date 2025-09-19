import type { Locale } from '@/middleware'

/**
 * Creates a localized path with the given locale prefix
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove existing locale prefix first
  const cleanPath = removeLocaleFromPath(path)

  // Remove leading slash if present after locale removal
  const normalizedPath = cleanPath.startsWith('/')
    ? cleanPath.slice(1)
    : cleanPath

  // If path is empty, return just the locale
  if (!normalizedPath) return `/${locale}`

  // Return the localized path
  return `/${locale}/${normalizedPath}`
}

/**
 * Extracts the locale from a pathname
 */
export function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const possibleLocale = segments[0]
  const validLocales: Locale[] = ['th', 'en', 'lo']

  return validLocales.includes(possibleLocale as Locale)
    ? (possibleLocale as Locale)
    : null
}

/**
 * Removes the locale prefix from a pathname
 */
export function removeLocaleFromPath(pathname: string): string {
  const locale = getLocaleFromPath(pathname)

  if (!locale) return pathname

  const withoutLocale = pathname.replace(`/${locale}`, '') || '/'
  return withoutLocale
}

/**
 * Get all available locales
 */
export function getAvailableLocales(): Locale[] {
  return ['th', 'en', 'lo']
}

/**
 * Get the default locale
 */
export function getDefaultLocale(): Locale {
  return 'en'
}

/**
 * Get asset path without locale prefix
 * This is important for static assets that should not include locale
 */
export function getAssetPath(path: string): string {
  // Remove locale prefix from asset paths
  if (
    path.startsWith('/en/') ||
    path.startsWith('/th/') ||
    path.startsWith('/lo/')
  ) {
    return path.replace(/^\/[a-z]{2}/, '')
  }
  return path
}

/**
 * Check if path is a static asset
 */
export function isStaticAsset(path: string): boolean {
  return (
    path.startsWith('/assets/') ||
    path.startsWith('/_next/') ||
    path.startsWith('/favicon') ||
    !!path.match(/\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|css|js)$/)
  )
}
