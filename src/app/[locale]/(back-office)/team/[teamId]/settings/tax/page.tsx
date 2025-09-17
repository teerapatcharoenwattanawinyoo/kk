'use client'

import { SettingsLayout } from '@/components/back-office/team/settings/settings-layout'
import { TaxSetting } from '@/components/back-office/team/settings/tab/tax-information-tab/tax-setting'
import { TeamGuard } from '@/components/back-office/team/team-guard'
import { useRouter } from 'next/navigation'
import { use } from 'react'

interface TaxSettingsPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

const TaxSettingsPage = ({ params }: TaxSettingsPageProps) => {
  const { locale, teamId } = use(params)
  const router = useRouter()

  const handleCreateClick = () => {
    router.push(`/${locale}/team/${teamId}/settings/tax/information/create`)
  }

  const handleEditClick = (taxData: { id: string }) => {
    router.push(`/${locale}/team/${teamId}/settings/tax/information/edit/${taxData.id}`)
  }

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <SettingsLayout teamId={teamId} locale={locale} title="Setting">
        <TaxSetting
          teamId={teamId}
          onCreateClick={handleCreateClick}
          onEditClick={handleEditClick}
        />
      </SettingsLayout>
    </TeamGuard>
  )
}

export default TaxSettingsPage
