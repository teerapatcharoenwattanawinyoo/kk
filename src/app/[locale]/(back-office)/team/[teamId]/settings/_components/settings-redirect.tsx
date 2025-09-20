'use client'

import FetchLoader from '@/components/FetchLoader'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface SettingsRedirectProps {
  teamId: string
  locale: string
}

export const SettingsRedirect = ({ teamId, locale }: SettingsRedirectProps) => {
  const router = useRouter()

  useEffect(() => {
    // Redirect to general settings by default
    router.replace(`/${locale}/team/${teamId}/settings/general`)
  }, [locale, teamId, router])

  return (
    <div className="flex h-full items-center justify-center bg-background">
      <FetchLoader />
    </div>
  )
}
