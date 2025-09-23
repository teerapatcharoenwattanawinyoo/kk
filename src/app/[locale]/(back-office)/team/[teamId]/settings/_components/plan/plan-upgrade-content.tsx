'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Database } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { useCurrentTeamPlan } from '../../_hooks/use-plans'
import { type BillingData } from './billing-information'
import { PricingPackages } from './pricing-packages'

export interface UsageData {
  stations: { used: number; limit: number }
  members: { used: number; limit: number }
}

export interface PlanUpgradeContentProps {
  usage: UsageData
  currentPlan?: string
  currentPlanId?: string
  // plans?: any[]
  upgradePlanAction: (teamId: string, planId: string) => Promise<{ error?: string } | void>
  teamId: string
  billingData: BillingData
  updatePaymentMethodAction: (teamId: string) => Promise<void>
  downloadInvoiceAction: (teamId: string) => Promise<void>
  viewBillingHistoryAction: (teamId: string) => Promise<void>
}

export function PlanUpgradeContent({
  usage,
  currentPlan,
  currentPlanId,
  upgradePlanAction,
  teamId,
  billingData,
  updatePaymentMethodAction,
  downloadInvoiceAction,
  viewBillingHistoryAction,
}: PlanUpgradeContentProps) {
  const [isPending, startTransition] = useTransition()
  const {
    plans: fetchedPlans,
    currentPlan: fetchedCurrentPlan,
    isLoading: isPlansLoading,
    isFetching: isPlansFetching,
  } = useCurrentTeamPlan(teamId)

  const stationsPct = Math.round((usage.stations.used / usage.stations.limit) * 100)
  const membersPct = Math.round((usage.members.used / usage.members.limit) * 100)

  const pricingPlans: any[] = fetchedPlans.length ? fetchedPlans : []

  const planFromProps =
    (currentPlanId ? pricingPlans.find((plan) => plan.id === currentPlanId) : undefined) ??
    (currentPlan ? pricingPlans.find((plan) => plan.package_name === currentPlan) : undefined)

  const activePlan = fetchedCurrentPlan ?? planFromProps ?? pricingPlans[0] ?? undefined

  const activePlanName =
    activePlan?.package_name ?? currentPlan ?? pricingPlans[0]?.package_name ?? '—'
  const activePlanId = activePlan?.id ?? currentPlanId ?? pricingPlans[0]?.id

  const visiblePlans: any[] =
    pricingPlans.length > 0 ? pricingPlans : activePlan ? [activePlan] : []

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
      <p className="mt-1 text-sm text-muted-foreground">Manage your subscription and billing</p>

      {/* Current Usage Section */}
      <div className="mb-10 mt-10">
        <Card className="shadow-none">
          <CardContent>
            <CardTitle className="flex items-center gap-2 text-xl font-medium">
              <Database className="h-5 w-5 font-medium" />
              <span>Current Usage</span>
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              You are currently on the {activePlanName} plan.
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
                <p className="mt-1 text-[11px] text-muted-foreground">{stationsPct}% used</p>
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
                <p className="mt-1 text-[11px] text-muted-foreground">{membersPct}% used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Packages Section */}
      <PricingPackages
        plans={visiblePlans}
        currentPlanId={activePlanId}
        onUpgrade={handleUpgrade}
        isLoading={isPending || isPlansLoading || isPlansFetching}
      />

      {/* Billing Information Section */}
      <div className="mt-10">
        {/* <BillingInformation
          billingData={billingData}
          updatePaymentMethodAction={updatePaymentMethodAction}
          downloadInvoiceAction={downloadInvoiceAction}
          viewBillingHistoryAction={viewBillingHistoryAction}
          teamId={teamId}
        /> */}
      </div>
    </div>
  )
}
