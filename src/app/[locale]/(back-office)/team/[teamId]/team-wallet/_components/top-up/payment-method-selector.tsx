'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useMemo, useState } from 'react'

import {
  topUpPaymentMethodsMock,
} from '../../../mock/top-up.mock'
import { type TopUpPaymentMethod } from '../../../_schemas/top-up.schema'

interface PaymentMethodSelectorProps {
  amount: string
  onPaymentSelect: (methodId: string, methodData: TopUpPaymentMethod) => void
  methods?: TopUpPaymentMethod[]
}

export function PaymentMethodSelector({
  amount,
  onPaymentSelect,
  methods = topUpPaymentMethodsMock,
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('')

  const THB = useMemo(
    () => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }),
    [],
  )

  const selectedMethodName = useMemo(
    () => methods.find((method) => method.id === selectedMethod)?.name ?? '-',
    [methods, selectedMethod],
  )

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
  }

  const handleProceed = () => {
    if (selectedMethod) {
      const methodData = methods.find((method) => method.id === selectedMethod)
      if (methodData) {
        onPaymentSelect(selectedMethod, methodData)
      }
    }
  }

  const amountNum = Number(amount) || 0
  const fee = 30 // ค่าธรรมเนียม
  const total = amountNum + fee

  return (
    <div className="space-y-10">
      {/* Main Card with Header, Payment Methods and Summary */}
      <Card className="block overflow-hidden border-none shadow-none">
        {/* Header inside card */}
        <CardTitle className="rounded-t-lg bg-primary p-4 pb-4 text-center font-semibold text-primary-foreground">
          เลือกช่องทางการชำระเงิน
        </CardTitle>

        <div className="mb-4 space-y-10 rounded-b-xl bg-muted/50 p-10">
          {/* Payment Methods (card-style tiles) */}
          <RadioGroup
            value={selectedMethod}
            onValueChange={handleMethodSelect}
            className="grid gap-4 sm:grid-cols-2"
          >
            {methods.map((method) => (
              <label
                key={method.id}
                htmlFor={`pm-${method.id}`}
                className={cn(
                  'relative block cursor-pointer rounded-2xl border bg-background p-6 shadow-sm transition-colors',
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-input hover:bg-accent/50',
                )}
              >
                <RadioGroupItem
                  id={`pm-${method.id}`}
                  value={method.id}
                  className="absolute left-4 top-4 focus-visible:ring-green-500/30 data-[state=checked]:border-green-500 data-[state=checked]:text-green-500"
                />
                <div className="flex flex-col items-center text-center">
                  <Avatar className="mb-4 h-16 w-16 bg-muted">
                    <AvatarImage src={method.icon} alt={method.name} className="object-cover" />
                    <AvatarFallback className="text-xs font-medium">
                      {method.name?.[0] ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      'text-base font-semibold',
                      selectedMethod === method.id ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {method.name}
                  </div>
                  {method.description && (
                    <div
                      className={cn(
                        'mt-1 text-sm',
                        selectedMethod === method.id ? 'text-primary' : 'text-muted-foreground',
                      )}
                    >
                      {method.description}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </RadioGroup>

          {/* Summary */}
          <div className="bg-sidebar rounded-lg border p-4">
            <h4 className="mb-3 font-semibold">รายละเอียด</h4>
            <Separator className="mb-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-light">
                <span>ยอดการเติมเงิน:</span>
                <span>{THB.format(amountNum)}</span>
              </div>
              <div className="flex justify-between font-light">
                <span>ช่องทางการเติมเงิน:</span>
                <span className="truncate text-right">{selectedMethodName}</span>
              </div>
              <div className="flex justify-between font-light">
                <span>ค่าธรรมเนียม: (3%)</span>
                <span>{THB.format(fee)}</span>
              </div>
              <div className="my-2 h-px w-full bg-border" />
              <div className="flex justify-between font-semibold">
                <span>ยอดรวมทั้งสิ้น</span>
                <span>{THB.format(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Proceed Button - Outside the card */}
      <Button className="h-12 w-full" disabled={!selectedMethod} onClick={handleProceed}>
        Continue
      </Button>
    </div>
  )
}
