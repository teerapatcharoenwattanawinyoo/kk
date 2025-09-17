import { EditMemberPriceGroup } from '@/components/back-office/team/edit'
import { TeamGuard } from '@/components/back-office/team/team-guard'

interface EditMemberPriceGroupPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

export default async function EditMemberPriceGroupPage({ params }: EditMemberPriceGroupPageProps) {
  const { teamId, locale } = await params

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <EditMemberPriceGroup />
    </TeamGuard>
  )
}
