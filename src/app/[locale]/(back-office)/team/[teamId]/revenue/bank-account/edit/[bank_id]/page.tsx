'use client'

import { EditBankAccountForm } from '@/components/back-office/team/revenue/bank-account'
import { TeamGuard } from '@/components/back-office/team/team-guard'
import { useParams } from 'next/navigation'

export default function EditBankAccountPage() {
  const params = useParams()
  const teamId = params.teamId as string
  const locale = params.locale as string
  const accountId = parseInt(typeof params.bank_id === 'string' ? params.bank_id : '')

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
      <EditBankAccountForm teamId={teamId} locale={locale} accountId={accountId} />
    </TeamGuard>
  )
}
