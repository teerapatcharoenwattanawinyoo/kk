import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { BankAccountManagePage } from '../_components/bank-account-manage-page'

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
      <BankAccountManagePage teamId={params.teamId} locale={params.locale} />
    </TeamGuard>
  )
}
