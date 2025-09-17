'use client'

import { DevelopmentPlaceholder } from '@/components/back-office/team/settings/development-placeholder'
import { SettingsLayout } from '@/components/back-office/team/settings/settings-layout'
import { TeamGuard } from '@/components/back-office/team/team-guard'
import { useI18n } from '@/lib/i18n'
import { use } from 'react'

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
