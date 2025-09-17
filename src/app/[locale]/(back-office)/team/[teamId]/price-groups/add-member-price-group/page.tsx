import { AddMemberPriceGroup } from '@/components/back-office/team/add'
import { TeamGuard } from '@/components/back-office/team/team-guard'

interface AddMemberPriceGroupPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

export default async function AddMemberPriceGroupPage({ params }: AddMemberPriceGroupPageProps) {
  const { teamId, locale } = await params

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <AddMemberPriceGroup />
    </TeamGuard>
  )
}
