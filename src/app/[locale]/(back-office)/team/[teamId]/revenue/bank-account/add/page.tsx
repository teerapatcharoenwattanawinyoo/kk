'use client'

import { AddBankAccountForm } from '@/components/back-office/team/revenue/bank-account'
import { TeamGuard } from '@/components/back-office/team/team-guard'
import { useParams } from 'next/navigation'

export default function AddBankAccountPage() {
  const params = useParams()
  const teamId = params.teamId as string
  const locale = params.locale as string

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <AddBankAccountForm teamId={teamId} locale={locale} />
    </TeamGuard>
  )
}
