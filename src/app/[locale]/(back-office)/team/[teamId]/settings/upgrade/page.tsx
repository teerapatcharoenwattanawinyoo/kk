import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { PlanUpgradeContent, type BillingData, type UsageData } from '../_components/plan'
import { SettingsLayout } from '../_components/settings-layout'
import { getPricingPlans } from '../_servers/plans.actions'
import { upgradePlanAction } from './actions'

interface PlanUpgradePageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

// Server-side data fetching (mock for now)
async function getUsageData(teamId: string): Promise<UsageData> {
  // TODO: Replace with actual API call

  // Mock data
  return {
    stations: { used: 18, limit: 25 },
    members: { used: 32, limit: 50 },
  }
}

// Server-side billing data fetching (mock for now)
async function getBillingData(teamId: string): Promise<BillingData> {
  // TODO: Replace with actual API call

  // Mock data
  return {
    nextBillingDate: 'February 15, 2024',
    paymentMethod: {
      type: 'card',
      lastFour: '4242',
      brand: 'Visa',
    },
  }
}

// Billing action handlers
async function updatePaymentMethodAction(teamId: string) {
  'use server'
  // TODO: Implement payment method update
  // update payment method (log removed)
}

async function downloadInvoiceAction(teamId: string) {
  'use server'
  // TODO: Implement invoice download
  // download invoice (log removed)
}

async function viewBillingHistoryAction(teamId: string) {
  'use server'
  // TODO: Implement billing history view
  // view billing history (log removed)
}

const PlanUpgradePage = async ({ params }: PlanUpgradePageProps) => {
  const { locale, teamId } = await params

  // Fetch data on server
  const [usage, pricingPlansResponse, billingData] = await Promise.all([
    getUsageData(teamId),
    getPricingPlans(teamId),
    getBillingData(teamId),
  ])

  const pricingPlans = pricingPlansResponse?.data ?? []

  const activePlan = pricingPlans.find((plan) => plan.is_default) ?? pricingPlans[0]

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <SettingsLayout teamId={teamId} locale={locale} title="Setting">
        <PlanUpgradeContent
          usage={usage}
          teamId={teamId}
          currentPlan={activePlan?.package_name}
          currentPlanId={activePlan?.id}
          upgradePlanAction={upgradePlanAction}
          billingData={billingData}
          updatePaymentMethodAction={updatePaymentMethodAction}
          downloadInvoiceAction={downloadInvoiceAction}
          viewBillingHistoryAction={viewBillingHistoryAction}
        />
      </SettingsLayout>
    </TeamGuard>
  )
}

export default PlanUpgradePage
