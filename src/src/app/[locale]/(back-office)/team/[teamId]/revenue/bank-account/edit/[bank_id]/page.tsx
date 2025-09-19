'use client'

import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { useParams } from 'next/navigation'
import { BankAccountFormEditPage } from '../../_components/bank-account-form-edit-page'

export default function EditBankAccountPage() {
  const params = useParams()
  const teamId = params.teamId as string
  const locale = params.locale as string
  const accountId = parseInt(
    typeof params.bank_id === 'string' ? params.bank_id : '',
  )

  if (isNaN(accountId)) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">ID บัญชีธนาคารไม่ถูกต้อง</p>
        </div>
      </div>
    )
  }

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <BankAccountFormEditPage
        teamId={teamId}
        locale={locale}
        accountId={accountId}
      />
    </TeamGuard>
  )
}
