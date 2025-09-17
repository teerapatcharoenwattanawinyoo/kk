import { useCallback } from 'react'

import { useI18n } from '../i18n'

type RouteLike = string

/**
 * Prefixes the provided route with the given locale while preserving any existing
 * query string or hash fragments.
 */
export function buildLocalizedPath(locale: string, route: RouteLike) {
  if (typeof route !== 'string' || route.length === 0) {
    return route
  }

  if (!route.startsWith('/')) {
    return route
  }

  const normalizedLocale = locale.replace(/^\/+|\/+$/g, '')

  if (!normalizedLocale) {
    return route
  }

  if (route === `/${normalizedLocale}` || route.startsWith(`/${normalizedLocale}/`)) {
    return route
  }

  const [pathname, ...suffixParts] = route.split(/(?=[?#])/)
  const suffix = suffixParts.join('')

  const normalizedPathname =
    pathname && pathname !== '/' ? (pathname.startsWith('/') ? pathname : `/${pathname}`) : ''

  const basePath = normalizedPathname
    ? `/${normalizedLocale}${normalizedPathname}`
    : `/${normalizedLocale}`

  return `${basePath}${suffix}`
}

/**
 * Returns a memoized helper that prefixes routes with the current locale.
 */
export function useLocalizedRoutes() {
  const { locale } = useI18n()

  return useCallback((route: RouteLike) => buildLocalizedPath(locale, route), [locale])
}
