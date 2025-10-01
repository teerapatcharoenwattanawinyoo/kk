'use client'

import { SuccessDialog } from '@/components/notifications'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { TopUpFlowLayout } from './top-up-flow-layout'

interface TopUpProcessPageProps {
  amount: string
  method: string
  orderId: string
  teamId: string
  locale: string
}

const PROCESS_SIMULATION_DELAY = 3000

export function TopUpProcessPage({ amount, method, orderId, teamId, locale }: TopUpProcessPageProps) {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false)
      setShowSuccess(true)
    }, PROCESS_SIMULATION_DELAY)

    return () => clearTimeout(timer)
  }, [])

  const handleSuccessClose = () => {
    setShowSuccess(false)
    router.push(`/${locale}/team/${teamId}/team-wallet`)
  }

  return (
    <TopUpFlowLayout
      backHref={`/${locale}/team/${teamId}/team-wallet/top-up/checkout?amount=${amount}`}
      title="ประมวลผลการชำระเงิน"
    >
      <div className="space-y-4 text-center">
        <div
          className={`mx-auto h-16 w-16 rounded-full border-b-2 border-primary ${isProcessing ? 'animate-spin' : ''}`}
        ></div>
        <h3 className="text-lg font-semibold">กำลังประมวลผลการชำระเงิน</h3>
        <p className="text-muted-foreground">
          เลขที่อ้างอิง: {orderId}
          <br />
          จำนวนเงิน: {amount} ฿<br />
          วิธีการชำระ: {method}
        </p>
        <p className="text-sm text-muted-foreground">กรุณารอสักครู่...</p>
      </div>

      <SuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Success"
        message="Top up success&#10;Thank you."
        buttonText="Done"
        onButtonClick={handleSuccessClose}
      />
    </TopUpFlowLayout>
  )
}
