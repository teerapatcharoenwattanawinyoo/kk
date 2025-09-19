import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { EditPriceGroup } from '../_components/edit/'
interface EditPriceGroupPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

export default async function EditPriceGroupPage({ params }: EditPriceGroupPageProps) {
  const { teamId, locale } = await params

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <EditPriceGroup />
    </TeamGuard>
  )
}
