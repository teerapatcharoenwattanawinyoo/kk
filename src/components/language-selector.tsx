'use client'

import { useLocale } from '@/hooks/use-locale'
import { useI18n, type Locale } from '@/lib/i18n'
import { Button } from '@/ui/atoms/button'
import Image from 'next/image'
import { useEffect } from 'react'

interface Language {
  code: Locale
  name: string
  flag: string
  alt: string
}

interface LanguageSelectorProps {
  selectedLanguage?: Locale
  onLanguageChange?: (language: Locale) => void
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const { locale, setLocale } = useI18n()
  const { assetPath } = useLocale()

  const languages: Language[] = [
    {
      code: 'th',
      name: 'TH',
      flag: assetPath('/assets/images/flags/th-flag.png'),
      alt: 'TH',
    },
    {
      code: 'en',
      name: 'EN',
      flag: assetPath('/assets/images/flags/uk-flag.png'),
      alt: 'EN',
    },
    {
      code: 'lo',
      name: 'LAOS',
      flag: assetPath('/assets/images/flags/laos-flag.png'),
      alt: 'LAOS',
    },
  ]

  const currentLanguage = selectedLanguage || locale

  useEffect(() => {
    if (selectedLanguage && selectedLanguage !== locale) {
      setLocale(selectedLanguage)
    }
  }, [selectedLanguage, locale, setLocale])

  const handleLanguageChange = (languageCode: Locale) => {
    setLocale(languageCode)
    onLanguageChange?.(languageCode)
  }

  return (
    <div className="flex gap-2">
      {languages.map((language) => (
        <Button
          key={language.code}
          variant={currentLanguage === language.code ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleLanguageChange(language.code)}
          className="flex h-8 w-12 items-center justify-center gap-1 px-2"
        >
          <Image
            src={language.flag}
            alt={language.alt}
            width={16}
            height={12}
            className="h-3 w-4 object-cover"
          />
          <span className="text-xs font-medium">{language.name}</span>
        </Button>
      ))}
    </div>
  )
}
