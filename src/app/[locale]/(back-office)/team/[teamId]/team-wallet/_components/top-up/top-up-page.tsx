'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

interface PaymentPageProps {
  teamId: string
  locale: string
}

import { topUpMockPageData } from '../../mock/top-up.mock'
import { TopUpPageView } from './top-up-page-view'

const MIN_AMOUNT = 300
const MAX_AMOUNT = 70000

export function TopUpPage({ teamId, locale }: PaymentPageProps) {
  const router = useRouter()
  const [amount, setAmount] = useState<number>(topUpMockPageData.presetAmounts[0] ?? MIN_AMOUNT)
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat('th-TH', { maximumFractionDigits: 0 }),
    [],
  )

  const handleContinue = () => {
    // Navigate to payment method selection page with amount
    router.push(`/${locale}/team/${teamId}/team-wallet/top-up/checkout?amount=${amount}`)
  }

  const teamWalletHref = `/${locale}/team/${teamId}/team-wallet`
  const formatNumber = (value: number) => numberFormatter.format(value)
  const isContinueDisabled = amount < MIN_AMOUNT || amount > MAX_AMOUNT

  return (
    <TopUpPageView
      teamId={teamId}
      pageTitle="Team-Wallet"
      heading="Top-Up"
      teamWalletHref={teamWalletHref}
      amount={amount}
      onAmountChange={setAmount}
      presetAmounts={topUpMockPageData.presetAmounts}
      transactionGroups={topUpMockPageData.transactionGroups}
      formatNumber={formatNumber}
      onContinue={handleContinue}
      isContinueDisabled={isContinueDisabled}
    />
  )
}
