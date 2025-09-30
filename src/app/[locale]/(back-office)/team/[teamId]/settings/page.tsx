'use client'

import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { use } from 'react'
import { SettingsRedirect } from './_components/settings-redirect'

interface TeamSettingsPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

const TeamSettingsPage = ({ params }: TeamSettingsPageProps) => {
  const { locale, teamId } = use(params)

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <SettingsRedirect teamId={teamId} locale={locale} />
    </TeamGuard>
  )
}

export default TeamSettingsPage
