import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'

import { TopUpProcessPage } from '../../../_layers/presentation'

interface ProcessPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
  searchParams: Promise<{
    amount?: string
    method?: string
    orderId?: string
    methodData?: string
  }>
}

export default async function ProcessPage({ params, searchParams }: ProcessPageProps) {
  const { teamId, locale } = await params
  const { amount, method, orderId } = await searchParams

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <TopUpProcessPage
        amount={amount || '0'}
        method={method || ''}
        orderId={orderId || ''}
        teamId={teamId}
        locale={locale}
      />
    </TeamGuard>
  )
}
