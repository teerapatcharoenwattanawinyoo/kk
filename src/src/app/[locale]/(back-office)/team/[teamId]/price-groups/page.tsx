import { PricingPage } from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_components/pricing-page'
import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'

interface PricingPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

export default async function TeamPricingPage({ params }: PricingPageProps) {
  const { teamId, locale } = await params
  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <PricingPage teamId={teamId} />
    </TeamGuard>
  )
}
