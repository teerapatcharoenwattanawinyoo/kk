'use client'

import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { use } from 'react'
import { DevelopmentPlaceholder } from '../_components/development-placeholder'
import { SettingsLayout } from '../_components/settings-layout'

interface TeamSettingPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

const TeamSettingPage = ({ params }: TeamSettingPageProps) => {
  const { locale, teamId } = use(params)

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <SettingsLayout teamId={teamId} locale={locale} title="Setting">
        <div className="mx-auto max-w-4xl p-6">
          <DevelopmentPlaceholder title="Team Setting" />
        </div>
      </SettingsLayout>
    </TeamGuard>
  )
}

export default TeamSettingPage
