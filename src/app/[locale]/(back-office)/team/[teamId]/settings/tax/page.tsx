'use client'

import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { SettingsLayout } from '../_components/settings-layout'
import { TaxSetting } from '../_components/tab/tax-information-tab/tax-setting'

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
