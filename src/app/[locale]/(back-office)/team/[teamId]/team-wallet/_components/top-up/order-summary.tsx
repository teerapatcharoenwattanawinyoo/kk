'use client'

import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { useMemo } from 'react'

import { type TopUpPaymentMethod } from '../../../_schemas/top-up.schema'

interface OrderSummaryProps {
  amount: string
  paymentMethod: string
  paymentMethodData?: TopUpPaymentMethod
  orderId: string
  description?: string
  logoSrc?: string
  logoAlt?: string
  onConfirm: () => void
}

export function OrderSummary({
  amount,
  paymentMethod,
  paymentMethodData,
  orderId,
  description = 'เติมเงินเข้ากระเป๋าผ่านระบบออนไลน์',
  logoSrc = '/assets/icons/iconOnecharge.png',
  logoAlt = 'OneCharge',
  onConfirm,
}: OrderSummaryProps) {
  const THB = useMemo(
    () => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }),
    [],
  )

  const amountNum = Number(amount) || 0
  const fee = 30 // ค่าธรรมเนียม
  const total = amountNum + fee

  const paymentMethodName =
    paymentMethodData?.name ||
    (paymentMethod === 'promptpay' ? 'บัตรดิต / เดบิต (ATM)' : paymentMethod)

  // Use payment method icon if available, otherwise use logo
  const displayIcon = paymentMethodData?.icon || logoSrc
  const displayAlt = paymentMethodData?.name || logoAlt

  return (
    <div className="space-y-10">
      {/* Main Card with Header and Summary */}
      <Card className="block overflow-hidden border-none shadow-none">
        {/* Header inside card */}
        <CardTitle className="rounded-t-lg bg-primary p-4 pb-4 text-center font-semibold text-primary-foreground">
          สรุปยอด
        </CardTitle>

        <div className="mb-4 space-y-10 rounded-b-xl bg-muted/50 p-10">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="h-40 w-40">
              <Image
                src="/assets/images/QR-TEST.png"
                alt="QR Code for Payment"
                width={150}
                height={150}
                unoptimized
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
          </div>

          {/* Order Summary Details */}
          <div className="bg-sidebar rounded-lg border p-4">
            <h4 className="mb-3 font-semibold">รายละเอียด</h4>
            <Separator className="mb-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-light">
                <span>เลขที่อ้างอิง</span>
                <span>{orderId}</span>
              </div>
              <div className="flex justify-between font-light">
                <span>รายละเอียดย่อ :</span>
                <span>{description}</span>
              </div>
              <div className="flex justify-between font-light">
                <span>ช่องทางการเติมเงิน :</span>
                <span>{paymentMethodName}</span>
              </div>
              <div className="flex justify-between font-light">
                <span>ยอดการเติมเงิน</span>
                <span>{THB.format(amountNum)}</span>
              </div>
              <div className="flex justify-between font-light">
                <span>ค่าธรรมเนียม : (3%)</span>
                <span>{THB.format(fee)}</span>
              </div>
              <div className="my-2 h-px w-full bg-border" />
              <div className="flex justify-between font-semibold">
                <span>ยอดการชำระรวม</span>
                <span>{THB.format(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Proceed Button */}
      <Button className="h-12 w-full bg-primary hover:bg-primary/90" onClick={onConfirm}>
        ชำระเงิน
      </Button>
    </div>
  )
}
