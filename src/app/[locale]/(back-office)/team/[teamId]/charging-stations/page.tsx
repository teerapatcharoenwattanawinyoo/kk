import { TeamGuard } from '@/components/back-office/team/team-guard'
import { ChargingStationsPage } from '@/modules/charging-stations/components/charging-stations-page'

interface ChargingStationsPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

export default async function TeamChargingStations({ params }: ChargingStationsPageProps) {
  const { teamId, locale } = await params
  // ส่ง teamId ไปยัง ChargingStationsPage component
  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <ChargingStationsPage teamId={teamId} />
    </TeamGuard>
  )
}
