'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckIcon } from 'lucide-react'
import { z } from 'zod'

export const pricingPlanSchema = z.object({
  id: z.string(),
  icon_package_path: z.string().url().optional().or(z.literal('')),
  package_name: z.string(),
  type_of_prices: z.string(),
  description: z.string(),
  price: z.string(),
  detail: z.array(z.string()),
  discount: z.string(),
  commission: z.string(),
  is_default: z.boolean(),
})

export type PricingPlan = z.infer<typeof pricingPlanSchema>

export interface PricingPackagesProps {
  plans: PricingPlan[]
  currentPlanId?: string
  onUpgrade?: (planId: string) => void
  isLoading?: boolean
}

export function PricingPackages({
  plans,
  currentPlanId,
}: PricingPackagesProps) {
  const currentPlan =
    plans.find((plan) => plan.is_default) ??
    (currentPlanId ? plans.find((plan) => plan.id === currentPlanId) : undefined)

  if (!currentPlan) {
    return null
  }

  const formattedPrice = Number.parseFloat(currentPlan.price)
  const formattedDiscount = Number.parseFloat(currentPlan.discount)
  const formattedCommission = Number.parseFloat(currentPlan.commission)

  return (
    <div className="mt-10">
      <Card className="relative mx-auto max-w-xl shadow-none">
        {currentPlan.is_default && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
            <Badge variant={'outline'} className="bg-background">
              <span className="font-medium">Current Plan</span>
            </Badge>
          </div>
        )}

        <CardContent className="p-6">
          <div className="mb-6 text-center">
            {currentPlan.icon_package_path ? (
              <div className="mb-3 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                  <img
                    alt={`${currentPlan.package_name} icon`}
                    className="h-8 w-8"
                    loading="lazy"
                    src={currentPlan.icon_package_path}
                  />
                </div>
              </div>
            ) : null}
            <h3 className="text-xl font-medium">{currentPlan.package_name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">
                ฿
                {Number.isFinite(formattedPrice)
                  ? formattedPrice.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : currentPlan.price}
              </span>
              <span className="text-muted-foreground">/{currentPlan.type_of_prices}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{currentPlan.description}</p>
          </div>

          <div className="mb-6 space-y-3">
            {currentPlan.detail.map((feature, index) => (
              <div key={`${currentPlan.id}-${index}`} className="flex items-start gap-2">
                <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                <span className="text-sm font-normal">{feature}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            <div>
              <span className="font-medium text-foreground">Discount:</span>{' '}
              {Number.isFinite(formattedDiscount)
                ? `฿${formattedDiscount.toFixed(2)}`
                : currentPlan.discount}
            </div>
            <div>
              <span className="font-medium text-foreground">Commission:</span>{' '}
              {Number.isFinite(formattedCommission)
                ? `฿${formattedCommission.toFixed(2)}`
                : currentPlan.commission}
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full" disabled variant={'outline'}>
              Current Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
