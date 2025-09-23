'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckIcon, Crown, Star, Zap } from 'lucide-react'

import { type PricingPlan } from '../../_schemas/plans.schema'

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
  const iconComponents = {
    zap: Zap,
    crown: Crown,
    star: Star,
  } as const

  const renderPlanIcon = (iconPath?: string, planName?: string) => {
    if (!iconPath) {
      return <CheckIcon className="h-8 w-8 text-primary" aria-hidden="true" />
    }

    if (iconPath.startsWith('lucide:')) {
      const iconKey = iconPath.split(':')[1] as keyof typeof iconComponents
      const IconComponent = iconComponents[iconKey]

      if (IconComponent) {
        return <IconComponent className="h-8 w-8 text-primary" aria-hidden="true" />
      }
    }

    return (
      <img
        src={iconPath}
        alt={planName ? `${planName} icon` : 'Plan icon'}
        className="h-8 w-8 object-contain"
      />
    )
  }

  const visiblePlans = plans.length > 0 ? plans : []

  const gridColumnsClass =
    visiblePlans.length >= 3
      ? 'md:grid-cols-3'
      : visiblePlans.length === 2
        ? 'md:grid-cols-2'
        : 'md:grid-cols-1'

  return (
    <div className="mt-10">
      <div className={`grid grid-cols-1 gap-6 ${gridColumnsClass}`}>
        {visiblePlans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlanId
          const isRecommendedPlan = plan.is_default && !isCurrentPlan

          const formattedPrice =
            typeof plan.price === 'number' ? plan.price.toLocaleString() : plan.price

          const cardStateClass = isCurrentPlan
            ? ''
            : isRecommendedPlan
              ? 'border-2 border-primary'
              : ''

          return (
            <Card key={plan.id} className={`relative shadow-none ${cardStateClass}`}>
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                  <Badge variant={'outline'} className="bg-background">
                    <span className="font-medium">Current Plan</span>
                  </Badge>
                </div>
              )}

              {isRecommendedPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                  <Badge variant={'outline'} className="bg-background">
                    <span className="font-medium">Popular</span>
                  </Badge>
                </div>
              )}

              <CardContent className="p-6">
                {/* Plan Header */}
                <div className="mb-6 text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="rounded-lg bg-primary/10 px-3 py-3">
                      {renderPlanIcon(plan.icon_package_path, plan.package_name)}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium">{plan.package_name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">฿{formattedPrice}</span>
                    <span className="text-muted-foreground">/{plan.type_of_prices}</span>
                  </div>
                  {/* {plan.discount && (
                    <p className="mt-1 text-xs font-semibold text-primary">Save {plan.discount}</p>
                  )}
                  {plan.commission && (
                    <p className="text-xs text-muted-foreground">
                      Commission fee {plan.commission}
                    </p>
                  )} */}
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
