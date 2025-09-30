'use client'

import { signOutAction } from '@/app/[locale]/(auth)/_actions'
import { ModeToggle } from '@/components/ModeToggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { useLocale } from '@/hooks/use-locale'
import { useI18n, type Locale } from '@/lib/i18n'
import { useInitialUser } from '@/lib/providers/user-provider'
import { Bell, Check, ChevronsUpDown, LogOut, Settings, User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

export function HeaderClient() {
  const { locale, t } = useI18n()
  const { assetPath } = useLocale()
  const { state, isMobile } = useSidebar()
  const { user: initialUser } = useInitialUser()

  // Avoid hydration mismatch for locale flag
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

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
      const currentPath = window.location.pathname
      const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/')
      const newPath = `/${languageCode}${pathWithoutLocale === '/' ? '/dashboard' : pathWithoutLocale}`
      window.location.href = newPath
    } catch (error) {
      console.warn('ไม่สามารถโหลดคำแปลได้:', error)
    }
  }, [])

  const currentFlag = mounted
    ? languages.find((lang) => lang.code === locale)?.flag ||
      assetPath('/assets/images/flags/uk-flag.png')
    : assetPath('/assets/images/flags/uk-flag.png')

  const headerLeft = isMobile
    ? '0px'
    : state === 'collapsed'
      ? 'var(--sidebar-width-icon)'
      : 'var(--sidebar-width)'

  return (
    <header
      className="bg-sidebar fixed right-0 top-0 z-40 flex h-12 items-center gap-2 border-b border-border/60 px-3 backdrop-blur-xl transition-colors duration-200 sm:h-14 sm:gap-4 sm:px-4 md:px-6"
      style={{ left: headerLeft }}
      role="banner"
    >
      <SidebarTrigger className="h-8 w-8 md:flex" aria-label="Toggle sidebar" />

      <div className="ml-auto flex items-center gap-1 sm:gap-2 md:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full sm:h-10 sm:w-10"
              aria-label="Select language"
            >
              <Image
                src={currentFlag}
                alt="Language"
                width={200}
                height={200}
                className="h-4 w-4 rounded-full bg-center bg-no-repeat object-cover sm:h-[18px] sm:w-[18px]"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 bg-background">
            <DropdownMenuLabel>{t('common.language')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                disabled={language.code === locale}
                onClick={() => language.code !== locale && handleLanguageChange(language.code)}
                className="flex items-center gap-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
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
                {language.code === locale && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex cursor-pointer items-center gap-1 rounded-lg p-1 hover:bg-muted/50 sm:gap-2 sm:p-2">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10">
                <AvatarFallback className="bg-[#798BFF] text-white">
                  <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col text-sm lg:flex">
                <span className="font-roboto max-w-24 truncate font-semibold text-[#798BFF] xl:max-w-32">
                  {initialUser?.profilename || 'ไม่สามารถโหลดชื่อได้'}
                </span>
                <span className="text-xs text-muted-foreground">{t('common.admin_station')}</span>
              </div>
              <ChevronsUpDown className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-background">
            <DropdownMenuLabel>{t('common.my_account')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>{t('common.profile')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('common.settings')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOutAction()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('auth.sign_out')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="text-oc-sidebar relative h-8 w-8 sm:h-10 sm:w-10"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute right-1 top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-destructive text-[9px] text-white sm:right-1.5 sm:top-1.5 sm:h-3 sm:w-3 sm:text-[10px]">
            2
          </span>
        </Button>
        <ModeToggle />
      </div>
    </header>
  )
}
