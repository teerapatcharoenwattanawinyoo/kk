import { useI18n as useI18nStore } from './index'

export function useTranslation() {
  const { t, locale, setLocale } = useI18nStore()

  return {
    t,
    locale,
    setLocale,
  }
}

export type { Locale } from './index'
