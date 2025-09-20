import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { AddMemberPriceGroup } from '../_components/add'

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
