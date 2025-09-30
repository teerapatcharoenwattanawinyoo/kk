'use client'

import { useRouter } from 'next/navigation'
import { TopUpPaymentMethod } from '../../_schemas/top-up.schema'
import { OrderSummary } from './order-summary'

interface SummaryContentProps {
  amount: string
  paymentMethod: string
  paymentMethodData?: TopUpPaymentMethod
  teamId: string
  locale: string
}

export function SummaryContent({
  amount,
  paymentMethod,
  paymentMethodData,
  teamId,
  locale,
}: SummaryContentProps) {
  const router = useRouter()

  // Generate order ID in format YYYYMMDDHHmmss (local time)
  const now = new Date()
  // YYYYMMDDHHmmss (local time)
  const orderId =
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}` +
    `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`

  const handleConfirm = () => {
    // Navigate to final payment processing
    const methodParams = paymentMethodData
      ? encodeURIComponent(JSON.stringify(paymentMethodData))
      : ''
    router.push(
      `/${locale}/team/${teamId}/team-wallet/top-up/checkout/process?amount=${amount}&method=${paymentMethod}&orderId=${orderId}&methodData=${methodParams}`,
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <OrderSummary
        amount={amount}
        paymentMethod={paymentMethod}
        paymentMethodData={paymentMethodData}
        orderId={orderId}
        description="เติมเงินเข้ากระเป๋าผ่านระบบออนไลน์"
        logoSrc="/assets/icons/iconOnecharge.png"
        logoAlt="OneCharge"
        onConfirm={handleConfirm}
      />
    </div>
  )
}
