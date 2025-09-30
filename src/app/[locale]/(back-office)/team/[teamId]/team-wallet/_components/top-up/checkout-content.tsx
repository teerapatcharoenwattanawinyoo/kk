'use client'

import { useRouter } from 'next/navigation'
import { topUpMockPaymentMethods } from '../../mock/top-up.mock'
import { TopUpPaymentMethod } from '../../_schemas/top-up.schema'
import { PaymentMethodSelector } from './payment-method-selector'

interface CheckoutContentProps {
  amount: string
  teamId: string
  locale: string
}

export function CheckoutContent({ amount, teamId, locale }: CheckoutContentProps) {
  const router = useRouter()

  const handlePaymentSelect = (methodId: string, methodData: TopUpPaymentMethod) => {
    // Navigate to summary page with method data
    const methodParams = encodeURIComponent(JSON.stringify(methodData))
    router.push(
      `/${locale}/team/${teamId}/team-wallet/top-up/checkout/summary?amount=${amount}&method=${methodId}&methodData=${methodParams}`,
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <PaymentMethodSelector
        amount={amount}
        paymentMethods={topUpMockPaymentMethods}
        onPaymentSelect={handlePaymentSelect}
      />
    </div>
  )
}
