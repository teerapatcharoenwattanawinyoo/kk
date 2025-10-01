import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { TopUpPage } from '../_layers/presentation'

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
