'use client'

import { Button } from '@/ui/atoms/button'
import Image from 'next/image'
import { useState } from 'react'

interface Language {
  code: string
  name: string
  flag: string
  alt: string
}

interface LanguageSelectorBodyRequestProps {
  onLanguageChange?: (languageCode: string) => void
  defaultLanguage?: string
}

export function LanguageSelectorBodyRequest({
  onLanguageChange,
  defaultLanguage = 'th',
}: LanguageSelectorBodyRequestProps) {
  const languages: Language[] = [
    {
      code: 'th',
      name: 'TH',
      flag: '/assets/images/flags/th-flag.png',
      alt: 'TH',
    },
    {
      code: 'en',
      name: 'EN',
      flag: '/assets/images/flags/uk-flag.png',
      alt: 'EN',
    },
    {
      code: 'lo',
      name: 'LAOS',
      flag: '/assets/images/flags/laos-flag.png',
      alt: 'LAOS',
    },
  ]

  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage)

  const handleLanguageClick = (languageCode: string) => {
    setCurrentLanguage(languageCode)
    if (onLanguageChange) {
      onLanguageChange(languageCode)
    }
  }

  return (
    <div className="flex gap-2">
      {languages.map((language) => (
        <Button
          key={language.code}
          type="button"
          variant={currentLanguage === language.code ? 'default' : 'outline'}
          size="sm"
          className="w-18 flex h-8 items-center justify-center gap-1 px-4"
          onClick={() => handleLanguageClick(language.code)}
        >
          <Image
            src={language.flag}
            alt={language.alt}
            width={16}
            height={12}
            className="h-4 w-4 rounded-full object-cover"
          />
          <span className="text-xs font-medium">{language.name}</span>
        </Button>
      ))}
    </div>
  )
}
