import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Locale = 'th' | 'en' | 'lo'

interface I18nStore {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

// ฟังก์ชันตรวจจับภาษา
export const detectLocaleFromPath = (): Locale | null => {
  if (typeof window === 'undefined') return null

  const pathname = window.location.pathname
  const pathSegments = pathname.split('/').filter(Boolean)

  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0]
    if (['th', 'en', 'lo'].includes(firstSegment)) {
      return firstSegment as Locale
    }
  }

  return null
}

export const detectLocaleFromDomain = (): Locale | null => {
  if (typeof window === 'undefined') return null

  const hostname = window.location.hostname

  // ตรวจจับภาษาจาก domain
  if (hostname.includes('.th.')) return 'th'
  if (hostname.includes('.lo.')) return 'lo'
  if (hostname.includes('.en.') || hostname.includes('.com')) return 'en'

  // ตรวจจับภาษาจาก subdomain
  const subdomain = hostname.split('.')[0]
  if (subdomain === 'th') return 'th'
  if (subdomain === 'lo') return 'lo'
  if (subdomain === 'en') return 'en'

  return null
}

export const detectDefaultLocale = (): Locale => {
  // 1. ตรวจสอบ URL path ก่อน
  const pathLocale = detectLocaleFromPath()
  if (pathLocale) return pathLocale

  // 2. ตรวจสอบ domain/subdomain
  const domainLocale = detectLocaleFromDomain()
  if (domainLocale) return domainLocale

  // 3. ตรวจสอบภาษาของ browser
  if (typeof window !== 'undefined' && navigator.language) {
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('th')) return 'th'
    if (browserLang.startsWith('lo')) return 'lo'
  }

  // 4. ใช้ภาษาอังกฤษเป็นค่าเริ่มต้น
  return 'en'
}

// การแปลภาษาเริ่มต้น
const defaultTranslations: Record<Locale, Record<string, string>> = {
  th: {},
  en: {},
  lo: {},
}

const translations = defaultTranslations

export const useI18n = create<I18nStore>()(
  persist(
    (set, get) => ({
      locale: detectDefaultLocale(),
      setLocale: (locale: Locale) => {
        set({ locale })
        // Comment out automatic URL update since we handle it manually in components
        // updateUrlWithLocale(locale);
      },
      t: (key: string, params?: Record<string, string | number>) => {
        const { locale } = get()

        const keys = key.split('.')
        let translation: unknown = translations[locale]

        for (const k of keys) {
          if (
            translation &&
            typeof translation === 'object' &&
            k in translation
          ) {
            translation = (translation as Record<string, unknown>)[k]
          } else {
            translation = undefined
            break
          }
        }

        const finalTranslation =
          typeof translation === 'string' ? translation : key

        if (!params) return finalTranslation

        return Object.entries(params).reduce(
          (str, [paramKey, value]) =>
            str.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value)),
          finalTranslation,
        )
      },
    }),
    {
      name: 'i18n-storage',
    },
  ),
)

// ฟังก์ชันอัปเดต URL ด้วยภาษา
export const updateUrlWithLocale = (locale: Locale) => {
  if (typeof window === 'undefined') return

  const pathname = window.location.pathname
  const pathSegments = pathname.split('/').filter(Boolean)

  // ตรวจสอบว่า segment แรกเป็น locale หรือไม่
  const validLocales: Locale[] = ['th', 'en', 'lo']
  const hasLocalePrefix =
    pathSegments.length > 0 && validLocales.includes(pathSegments[0] as Locale)

  // ลบ locale เก่าออก (ถ้ามี)
  const cleanSegments = hasLocalePrefix ? pathSegments.slice(1) : pathSegments

  // สร้าง path ใหม่ด้วย locale ใหม่
  const newPath = `/${locale}${cleanSegments.length > 0 ? '/' + cleanSegments.join('/') : ''}`

  // ใช้ replace เพื่อหลีกเลี่ยงการเพิ่มใน browser history
  window.history.replaceState({}, '', newPath)
}

// ฟังก์ชันโหลดการแปลภาษาแบบ dynamic
export const loadTranslations = async (locale: Locale) => {
  try {
    const translationModule = await import(`./locales/${locale}.json`)
    translations[locale] = translationModule.default
  } catch (error) {
    console.warn(`Failed to load translations for ${locale}:`, error)
  }
}

// เริ่มต้นการแปลภาษาสำหรับภาษาปัจจุบัน
export const initI18n = async (locale?: Locale) => {
  const detectedLocale = locale || detectDefaultLocale()

  await Promise.all([
    loadTranslations('th'),
    loadTranslations('en'),
    loadTranslations('lo'),
  ])

  useI18n.getState().setLocale(detectedLocale)
  return detectedLocale
}

// ฟังก์ชันจัดการ URL และภาษา
export const getLocaleFromPathname = (pathname: string): Locale | null => {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && ['th', 'en', 'lo'].includes(segments[0])) {
    return segments[0] as Locale
  }
  return null
}

export const removeLocaleFromPathname = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && ['th', 'en', 'lo'].includes(segments[0])) {
    return '/' + segments.slice(1).join('/')
  }
  return pathname
}

export const addLocaleToPathname = (
  pathname: string,
  locale: Locale,
): string => {
  // ตรวจสอบว่า pathname มีภาษาอยู่แล้วหรือไม่
  const currentLocale = getLocaleFromPathname(pathname)

  // ถ้ามีภาษาอยู่แล้วและเป็นภาษาเดียวกัน ให้ return ตัวเดิม
  if (currentLocale === locale) {
    return pathname
  }

  // ไม่เพิ่ม prefix ภาษาสำหรับภาษาอังกฤษ (default)
  if (locale === 'en') {
    return removeLocaleFromPathname(pathname)
  }

  // เพิ่มภาษาใหม่ โดยลบภาษาเก่าออกก่อน (ถ้ามี)
  const cleanPathname = removeLocaleFromPathname(pathname)
  return `/${locale}${cleanPathname}`
}

export const getLocalizedUrl = (url: string, locale: Locale): string => {
  try {
    const urlObj = new URL(url)
    urlObj.pathname = addLocaleToPathname(urlObj.pathname, locale)
    return urlObj.toString()
  } catch {
    // ถ้า URL เป็น relative path
    return addLocaleToPathname(url, locale)
  }
}
