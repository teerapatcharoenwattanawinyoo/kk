'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Crown, Database, Star, Zap } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { BillingInformation, type BillingData } from './billing-information'
import { PricingPackages, type PricingPlan } from './pricing-packages'

export interface UsageData {
  stations: { used: number; limit: number }
  members: { used: number; limit: number }
}

export interface PlanUpgradeContentProps {
  usage: UsageData
  currentPlan?: string
  currentPlanId?: string
  upgradePlanAction: (
    teamId: string,
    planId: string,
  ) => Promise<{ error?: string } | void>
  teamId: string
  billingData: BillingData
  updatePaymentMethodAction: (teamId: string) => Promise<void>
  downloadInvoiceAction: (teamId: string) => Promise<void>
  viewBillingHistoryAction: (teamId: string) => Promise<void>
}

export function PlanUpgradeContent({
  usage,
  currentPlan = 'Professional',
  currentPlanId = 'professional',
  upgradePlanAction,
  teamId,
  billingData,
  updatePaymentMethodAction,
  downloadInvoiceAction,
  viewBillingHistoryAction,
}: PlanUpgradeContentProps) {
  const [isPending, startTransition] = useTransition()

  const stationsPct = Math.round(
    (usage.stations.used / usage.stations.limit) * 100,
  )
  const membersPct = Math.round(
    (usage.members.used / usage.members.limit) * 100,
  )

  // Mock pricing plans data (ตาม design ที่แนบมา)
  const pricingPlans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 129,
      period: 'month',
      description: 'Perfect for small teams getting started',
      icon: <Zap className="h-8 w-8 text-primary" />,
      features: [
        'Up to 5 charging stations',
        'Basic analytics',
        'Email support',
        '5GB storage',
        'Standard integrations',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 329,
      period: 'month',
      description: 'Best for growing businesses',
      icon: <Crown className="h-8 w-8 text-primary" />,
      isPopular: true,
      features: [
        'Up to 25 charging stations',
        'Advanced analytics & reporting',
        'Priority support',
        '50GB storage',
        'API access',
        'Custom branding',
        'Multi-location support',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 999,
      period: 'month',
      description: 'For large scale operations',
      icon: <Star className="h-8 w-8 text-primary" />,
      features: [
        'Unlimited charging stations',
        'Real-time monitoring',
        '24/7 phone support',
        'Unlimited storage',
        'Custom integrations',
        'White-label solution',
        'Dedicated account manager',
        'SLA guarantee',
      ],
    },
  ]

  const handleUpgrade = (planId: string) => {
    startTransition(async () => {
      try {
        const result = await upgradePlanAction(teamId, planId)

        if (result?.error) {
          toast.error(result.error)
        } else {
          toast.success(`Successfully initiated upgrade to ${planId} plan!`)
        }
      } catch (error) {
        toast.error('An unexpected error occurred. Please try again.')
      }
    })
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <Label className="text-2xl font-semibold">Plan Upgrade</Label>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your subscription and billing
      </p>

      {/* Current Usage Section */}
      <div className="mb-10 mt-10">
        <Card className="shadow-none">
          <CardContent>
            <CardTitle className="flex items-center gap-2 text-xl font-medium">
              <Database className="h-5 w-5 font-medium" />
              <span>Current Usage</span>
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              You are currently on the {currentPlan} plan.
            </p>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
              {/* Charging Stations */}
              <div>
                <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium">Charging Stations</span>
                  <span className="text-muted-foreground">
                    {usage.stations.used}/{usage.stations.limit}
                  </span>
                </div>
                <Progress value={stationsPct} className="h-2" />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {stationsPct}% used
                </p>
              </div>

              {/* Team Members */}
              <div>
                <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium">Team Members</span>
                  <span className="text-muted-foreground">
                    {usage.members.used}/{usage.members.limit}
                  </span>
                </div>
                <Progress value={membersPct} className="h-2" />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {membersPct}% used
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Packages Section */}
      <PricingPackages
        plans={pricingPlans}
        currentPlanId={currentPlanId}
        onUpgrade={handleUpgrade}
        isLoading={isPending}
      />

      {/* Billing Information Section */}
      <div className="mt-10">
        <BillingInformation
          billingData={billingData}
          updatePaymentMethodAction={updatePaymentMethodAction}
          downloadInvoiceAction={downloadInvoiceAction}
          viewBillingHistoryAction={viewBillingHistoryAction}
          teamId={teamId}
        />
      </div>
    </div>
  )
}
