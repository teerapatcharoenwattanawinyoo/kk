import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { AddPriceGroup } from '../_components/add'

interface AddPriceGroupPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

export default async function AddPriceGroupPage({ params }: AddPriceGroupPageProps) {
  const { teamId, locale } = await params

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <AddPriceGroup />
    </TeamGuard>
  )
}
