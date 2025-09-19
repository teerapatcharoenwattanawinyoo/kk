import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { PaymentPage } from '@/components/back-office/team/team-wallet'

interface PaymentPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

export default async function TeamWallet({ params }: PaymentPageProps) {
  const { teamId, locale } = await params

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <PaymentPage teamId={teamId} />
    </TeamGuard>
  )
}
