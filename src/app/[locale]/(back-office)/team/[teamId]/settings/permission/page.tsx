'use client'

import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { useI18n } from '@/lib/i18n'
import { use } from 'react'
import { DevelopmentPlaceholder } from '../_components/development-placeholder'
import { SettingsLayout } from '../_components/settings-layout'

interface TeamPermissionPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

const TeamPermissionPage = ({ params }: TeamPermissionPageProps) => {
  const { t } = useI18n()
  const { locale, teamId } = use(params)

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <SettingsLayout teamId={teamId} locale={locale} title={t('team_tabs.settings')}>
        <div className="p-4 lg:p-6">
          <DevelopmentPlaceholder title="Team Permission" />
        </div>
      </SettingsLayout>
    </TeamGuard>
  )
}

export default TeamPermissionPage
