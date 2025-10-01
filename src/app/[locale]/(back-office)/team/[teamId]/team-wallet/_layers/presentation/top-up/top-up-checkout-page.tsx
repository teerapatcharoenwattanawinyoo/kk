'use client'

import { useRouter } from 'next/navigation'

import { PaymentMethodSelector } from '../../../_components/top-up/payment-method-selector'
import {
  topUpPaymentMethodsMock,
} from '../../../mock/top-up.mock'
import { type TopUpPaymentMethod } from '../../../_schemas/top-up.schema'
import { TopUpFlowLayout } from './top-up-flow-layout'

interface TopUpCheckoutPageProps {
  amount: string
  teamId: string
  locale: string
  paymentMethods?: TopUpPaymentMethod[]
}

export function TopUpCheckoutPage({
  amount,
  teamId,
  locale,
  paymentMethods = topUpPaymentMethodsMock,
}: TopUpCheckoutPageProps) {
  const router = useRouter()

  const handlePaymentSelect = (methodId: string, methodData: TopUpPaymentMethod) => {
    const methodParams = encodeURIComponent(JSON.stringify(methodData))
    router.push(
      `/${locale}/team/${teamId}/team-wallet/top-up/checkout/summary?amount=${amount}&method=${methodId}&methodData=${methodParams}`,
    )
  }

  return (
    <TopUpFlowLayout backHref={`/${locale}/team/${teamId}/team-wallet/top-up`} title="Back">
      <div className="mx-auto max-w-md">
        <PaymentMethodSelector amount={amount} methods={paymentMethods} onPaymentSelect={handlePaymentSelect} />
      </div>
    </TopUpFlowLayout>
  )
}
