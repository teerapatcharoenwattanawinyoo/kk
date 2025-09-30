import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'

import { TeamWalletPage } from './_layers/presentation/team-wallet-page'

interface TeamWalletRouteProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

export default async function TeamWallet({ params }: TeamWalletRouteProps) {
  const { teamId, locale } = await params

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <TeamWalletPage teamId={teamId} />
    </TeamGuard>
  )
}
