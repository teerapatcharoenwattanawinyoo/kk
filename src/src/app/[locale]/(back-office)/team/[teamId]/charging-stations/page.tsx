import { ChargingStationsPage } from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations'
import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'

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
