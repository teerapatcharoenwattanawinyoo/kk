'use client'

import { useI18n } from '@/lib/i18n'
import { useRouter } from 'next/navigation'
import { SettingsLayout } from '../../_components/settings-layout'
import { GeneralSettingTab } from '../../_components/tab/general-setting-tab'

interface GeneralSettingsContentProps {
  teamId: string
  locale: string
}

export const GeneralSettingsContent = ({
  teamId,
  locale,
}: GeneralSettingsContentProps) => {
  const { t } = useI18n()
  const router = useRouter()

  const handleCancel = () => {
    // Go back to team overview
    router.push(`/${locale}/team/${teamId}/overview`)
  }

  return (
    <SettingsLayout
      teamId={teamId}
      locale={locale}
      title={t('team_tabs.settings')}
    >
      <div className="p-4 lg:p-6">
        <GeneralSettingTab teamId={teamId} onCancel={handleCancel} />
      </div>
    </SettingsLayout>
  )
}
