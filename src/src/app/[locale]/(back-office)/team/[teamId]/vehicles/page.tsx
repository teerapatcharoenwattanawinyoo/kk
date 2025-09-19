import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import VehiclesPage from '@/components/back-office/team/vehicles/vehicls-page'

interface VehiclesPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

export default async function page(props: VehiclesPageProps) {
  const params = await props.params
  return (
    <TeamGuard teamId={params.teamId} locale={params.locale}>
      <VehiclesPage teamId={params.teamId} />
    </TeamGuard>
  )
}
