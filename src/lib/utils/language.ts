export type Language = 'th' | 'en' | 'lo'
export type LanguageId = 1 | 2 | 3

export const LANGUAGE_MAP: Record<Language, LanguageId> = {
  th: 1,
  en: 2,
  lo: 3,
}

export function getLanguageId(lang: Language = 'th'): LanguageId {
  return LANGUAGE_MAP[lang]
}

export function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    try {
      const persistedState = localStorage.getItem('i18n-storage')
      if (persistedState) {
        const parsed = JSON.parse(persistedState)
        if (
          parsed?.state?.locale &&
          ['th', 'en', 'lo'].includes(parsed.state.locale)
        ) {
          return parsed.state.locale as Language
        }
      }
    } catch (error) {
      console.warn('Error reading locale from storage:', error)
    }

    // อ่านจาก URL pathname เป็น fallback
    const pathname = window.location.pathname
    const langFromPath = pathname.split('/')[1]
    if (langFromPath && ['th', 'en', 'lo'].includes(langFromPath)) {
      return langFromPath as Language
    }
  }

  return 'th'
}
