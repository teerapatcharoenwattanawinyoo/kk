'use client'

import { useParams } from 'next/navigation'
import { TransactionDetail } from '../../_components/transaction-detail'

export default function TransactionDetailPage() {
  const params = useParams()
  const teamId = params.teamId as string
  const transactionId = params.transactionId as string
  const locale = params.locale as string

  return (
    <TransactionDetail
      transactionId={transactionId}
      teamId={teamId}
      locale={locale}
    />
  )
}
