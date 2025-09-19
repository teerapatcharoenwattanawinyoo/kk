'use client'

import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { use } from 'react'
import { GeneralSettingsContent } from './_components/general-settings-content'

interface GeneralSettingsPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

const GeneralSettingsPage = ({ params }: GeneralSettingsPageProps) => {
  const { locale, teamId } = use(params)

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <GeneralSettingsContent teamId={teamId} locale={locale} />
    </TeamGuard>
  )
}

export default GeneralSettingsPage
