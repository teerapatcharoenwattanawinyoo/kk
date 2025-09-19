'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLocale } from '@/hooks/use-locale'
import { useI18n, type Locale } from '@/lib/i18n'
import { Check, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { locale, t } = useI18n()
  const { assetPath } = useLocale()

  // สถานะสำหรับป้องกัน hydration mismatch
  const [mounted, setMounted] = useState(false)

  // เอฟเฟคสำหรับป้องกัน hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    {
      code: 'en' as Locale,
      flag: assetPath('/assets/images/flags/uk-flag.png'),
      name: 'English',
    },
    {
      code: 'th' as Locale,
      flag: assetPath('/assets/images/flags/th-flag.png'),
      name: 'ไทย',
    },
    {
      code: 'lo' as Locale,
      flag: assetPath('/assets/images/flags/laos-flag.png'),
      name: 'ລາວ',
    },
  ]

  const handleLanguageChange = useCallback(async (languageCode: Locale) => {
    try {
      const { loadTranslations } = await import('@/lib/i18n')
      await loadTranslations(languageCode)

      // แทนที่ path อย่างง่าย - ลบ locale ปัจจุบันและเพิ่ม locale ใหม่
      const currentPath = window.location.pathname
      const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/')
      const newPath = `/${languageCode}${pathWithoutLocale === '/' ? '/' : pathWithoutLocale}`

      window.location.href = newPath
    } catch (error) {
      console.warn('ไม่สามารถโหลดคำแปลได้:', error)
    }
  }, [])

  // คำนวณธงปัจจุบันด้วยความปลอดภัยจาก hydration
  const currentFlag = mounted
    ? languages.find((lang) => lang.code === locale)?.flag ||
      assetPath('/assets/images/flags/uk-flag.png')
    : assetPath('/assets/images/flags/uk-flag.png')

  return (
    <div className="flex min-h-screen">
      {/* Left side - Background */}
      <div className="relative mx-2 my-2 hidden lg:flex lg:w-1/2">
        {/* Additional SVG Graphic */}
        <div className="absolute left-[-11.77px] top-[170px] z-10">
          <Image
            src="/assets/images/background/sdqe.png"
            alt="Technology Stack Diagram"
            width={213}
            height={80}
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {/* Background image */}
          <Image
            src="/assets/images/background/bg-login.png"
            alt="EV Charging Station"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0">
            <Image
              src="/assets/images/background/image1.svg"
              alt="Overlay Pattern"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content overlay */}
          <div className="absolute inset-0">
            <div className="flex h-full items-center justify-start">
              <div className="z-20 mx-20 px-10 text-left text-white">
                <h1 className="mb-4 text-7xl font-bold">{t('auth.title')}</h1>
                <p className="max-w-xl text-xl text-blue-100">
                  {t('auth.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 items-center justify-center bg-card p-8 lg:w-1/2">
        {/* Language selector in top-left */}
        <div className="absolute left-8 top-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="default"
                aria-label="Select language"
                className="backdrop-blur-xs bg-background/10 hover:bg-background/20"
              >
                <Image
                  src={currentFlag}
                  alt="Language"
                  width={20}
                  height={20}
                  className="h-5 w-5 rounded-full object-cover"
                />
                <ChevronDown className="h-4 w-4 text-secondary/30" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>{t('common.language')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  disabled={language.code === locale}
                  onClick={() =>
                    language.code !== locale &&
                    handleLanguageChange(language.code)
                  }
                  className="flex items-center gap-2"
                  aria-checked={language.code === locale}
                  role="menuitemcheckbox"
                >
                  <Image
                    src={language.flag}
                    alt={language.name}
                    width={16}
                    height={16}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                  <span className="text-sm">{language.name}</span>
                  {language.code === locale && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Logo in top-right */}
        <div className="absolute right-8 top-8">
          <Image
            src={assetPath('/assets/images/logo/OneChargeLogo.svg')}
            alt="OneCharge Logo"
            width={158}
            height={32}
            style={{
              width: 'auto',
              height: 'auto',
            }}
          />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
