import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { EditMemberPriceGroup } from '../_components/edit'

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
