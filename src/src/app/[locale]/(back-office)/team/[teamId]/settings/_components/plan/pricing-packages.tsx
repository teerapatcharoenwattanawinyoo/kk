'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckIcon } from 'lucide-react'

export interface PricingPlan {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  icon: React.ReactNode
  isCurrentPlan?: boolean
  isPopular?: boolean
}

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
  return (
    <div className="mt-10">
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlanId

          return (
            <Card
              key={plan.id}
              className={`relative shadow-none ${
                plan.isPopular
                  ? 'scale-105 border-2 border-primary'
                  : isCurrentPlan
                    ? 'border-green-500'
                    : ''
              }`}
            >
              {plan.isPopular && (
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
                    <div className="rounded-lg bg-primary/10 px-3 py-3">
                      {plan.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">฿{plan.price}</span>
                    <span className="text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="mb-6 space-y-3">
                  {plan.features.map((feature, index) => (
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
                      variant={plan.isPopular ? 'outline' : 'default'}
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
