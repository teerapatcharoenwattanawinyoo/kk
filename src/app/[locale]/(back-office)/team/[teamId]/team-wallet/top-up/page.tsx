import { TeamGuard } from '@/components/back-office/team/team-guard'
import { TopUpPage } from '@/components/back-office/team/team-wallet'

interface PaymentPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

export default async function TopUp({ params }: PaymentPageProps) {
  const { teamId, locale } = await params
  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <TopUpPage teamId={teamId} locale={locale} />
    </TeamGuard>
  )
}
