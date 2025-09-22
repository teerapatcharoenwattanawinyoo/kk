'use client'

import { z } from 'zod'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckIcon } from 'lucide-react'

export const pricingPlanSchema = z.object({
  id: z.string(),
  icon_package_path: z.string().optional(),
  package_name: z.string(),
  type_of_prices: z.string(),
  description: z.string(),
  price: z.string(),
  detail: z.array(z.string()),
  discount: z.string().optional(),
  commission: z.string().optional(),
  is_default: z.boolean().optional(),
})

export type PricingPlan = z.infer<typeof pricingPlanSchema>

export interface PricingPackagesProps {
  plans: PricingPlan[]
  currentPlanId?: string
  onUpgrade: (planId: string) => void
  isLoading?: boolean
}

export function PricingPackages({
  plans,
  currentPlanId,
  onUpgrade,
  isLoading = false,
}: PricingPackagesProps) {
  const gridColumnsClass =
    plans.length >= 3 ? 'md:grid-cols-3' : plans.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'

  return (
    <div className="mt-10">
      <div className={`grid grid-cols-1 gap-6 ${gridColumnsClass}`}>
        {plans.map((plan) => {
          const isCurrentPlan = plan.is_default || plan.id === currentPlanId

          return (
            <Card
              key={plan.id}
              className={`relative shadow-none ${
                isCurrentPlan ? 'border-2 border-green-500' : ''
              }`}
            >
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                  <Badge variant={'outline'} className="bg-background">
                    <span className="font-medium">Current Plan</span>
                  </Badge>
                </div>
              )}

              <CardContent className="p-6">
                {/* Plan Header */}
                <div className="mb-6 text-center">
                  <div className="mb-3 flex justify-center">
                    {plan.icon_package_path ? (
                      <div className="rounded-lg bg-primary/10 px-3 py-3">
                        <img
                          src={plan.icon_package_path}
                          alt={`${plan.package_name} icon`}
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="rounded-lg bg-primary/10 px-3 py-3">
                        <CheckIcon className="h-8 w-8 text-primary" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-medium">{plan.package_name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">฿{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.type_of_prices}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </div>

                {/* Features List */}
                <div className="mb-6 space-y-3">
                  {plan.detail.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm font-normal">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                  {isCurrentPlan ? (
                    <Button variant={'outline'} className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onUpgrade(plan.id)}
                      disabled={isLoading}
                      className={`w-full`}
                      variant={'default'}
                    >
                      {isLoading ? 'Processing...' : 'Upgrade'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
