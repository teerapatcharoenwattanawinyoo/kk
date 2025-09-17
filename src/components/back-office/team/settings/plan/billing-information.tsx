'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'

export interface BillingData {
  nextBillingDate: string
  paymentMethod: {
    type: string
    lastFour: string
    brand: string
  }
}

export interface BillingInformationProps {
  billingData: BillingData
  updatePaymentMethodAction: (teamId: string) => Promise<void>
  downloadInvoiceAction: (teamId: string) => Promise<void>
  viewBillingHistoryAction: (teamId: string) => Promise<void>
  teamId: string
}

export function BillingInformation({
  billingData,
  updatePaymentMethodAction,
  downloadInvoiceAction,
  viewBillingHistoryAction,
  teamId,
}: BillingInformationProps) {
  return (
    <Card className="w-full max-w-6xl shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Shield />
          <span>Billing Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Billing Details Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Next Billing Date */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Next Billing Date</h3>
            <p className="text-sm text-gray-900">{billingData.nextBillingDate}</p>
          </div>

          {/* Payment Method */}
          <div className="space-y-2 justify-self-end text-right">
            <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
            <p className="text-sm text-gray-900">
              •••• •••• •••• {billingData.paymentMethod.lastFour} ({billingData.paymentMethod.brand}
              )
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePaymentMethodAction(teamId)}
            className="text-sm"
          >
            Update Payment Method
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadInvoiceAction(teamId)}
            className="text-sm"
          >
            Download Invoice
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => viewBillingHistoryAction(teamId)}
            className="text-sm"
          >
            Billing History
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
