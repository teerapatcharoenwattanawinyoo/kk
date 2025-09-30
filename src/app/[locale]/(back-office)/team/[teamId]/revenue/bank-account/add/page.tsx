'use client'

import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { useParams } from 'next/navigation'
import { BankAccountFormAddPage } from '../_components/bank-account-form-add-page'

export default function AddBankAccountPage() {
  const params = useParams()
  const teamId = params.teamId as string
  const locale = params.locale as string

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <BankAccountFormAddPage teamId={teamId} locale={locale} />
    </TeamGuard>
  )
}
