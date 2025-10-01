'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

import { OrderSummary } from '../../../_components/top-up/order-summary'
import { type TopUpPaymentMethod } from '../../../_schemas/top-up.schema'
import { TopUpFlowLayout } from './top-up-flow-layout'

interface TopUpSummaryPageProps {
  amount: string
  paymentMethod: string
  paymentMethodData?: TopUpPaymentMethod
  teamId: string
  locale: string
}

const buildOrderId = () => {
  const now = new Date()
  return (
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}` +
    `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
  )
}

export function TopUpSummaryPage({
  amount,
  paymentMethod,
  paymentMethodData,
  teamId,
  locale,
}: TopUpSummaryPageProps) {
  const router = useRouter()
  const orderId = useMemo(buildOrderId, [])

  const handleConfirm = () => {
    const methodParams = paymentMethodData ? encodeURIComponent(JSON.stringify(paymentMethodData)) : ''
    router.push(
      `/${locale}/team/${teamId}/team-wallet/top-up/checkout/process?amount=${amount}&method=${paymentMethod}&orderId=${orderId}&methodData=${methodParams}`,
    )
  }

  return (
    <TopUpFlowLayout
      backHref={`/${locale}/team/${teamId}/team-wallet/top-up/checkout?amount=${amount}`}
      title="Back"
    >
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
    </TopUpFlowLayout>
  )
}
