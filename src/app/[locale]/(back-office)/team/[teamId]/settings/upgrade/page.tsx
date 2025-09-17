import {
  PlanUpgradeContent,
  type BillingData,
  type UsageData,
} from '@/components/back-office/team/settings/plan'
import { SettingsLayout } from '@/components/back-office/team/settings/settings-layout'
import { TeamGuard } from '@/components/back-office/team/team-guard'
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

async function getCurrentPlan(teamId: string): Promise<{ planName: string; planId: string }> {
  // TODO: Replace with actual API call

  // Mock data
  return { planName: 'Professional', planId: 'professional' }
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
  console.log('Update payment method for team:', teamId)
}

async function downloadInvoiceAction(teamId: string) {
  'use server'
  // TODO: Implement invoice download
  console.log('Download invoice for team:', teamId)
}

async function viewBillingHistoryAction(teamId: string) {
  'use server'
  // TODO: Implement billing history view
  console.log('View billing history for team:', teamId)
}

const PlanUpgradePage = async ({ params }: PlanUpgradePageProps) => {
  const { locale, teamId } = await params

  // Fetch data on server
  const [usage, currentPlan, billingData] = await Promise.all([
    getUsageData(teamId),
    getCurrentPlan(teamId),
    getBillingData(teamId),
  ])

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <SettingsLayout teamId={teamId} locale={locale} title="Setting">
        <PlanUpgradeContent
          usage={usage}
          teamId={teamId}
          currentPlan={currentPlan.planName}
          currentPlanId={currentPlan.planId}
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
