import { ManageBankAccountPage } from '@/components/back-office/team/revenue/bank-account'
import { TeamGuard } from '@/components/back-office/team/team-guard'

interface ManageBankAccountPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

export default async function TeamManageBankAccountPage(props: ManageBankAccountPageProps) {
  const params = await props.params
  return (
    <TeamGuard teamId={params.teamId} locale={params.locale}>
      <ManageBankAccountPage teamId={params.teamId} locale={params.locale} />
    </TeamGuard>
  )
}
