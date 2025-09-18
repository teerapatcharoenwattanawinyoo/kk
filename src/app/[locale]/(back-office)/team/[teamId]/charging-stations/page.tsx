import { ChargingStationsPage } from "@/components/back-office/team/charging-stations/charging-stations-page";
import { TeamGuard } from "@/components/back-office/team/team-guard";

interface ChargingStationsPageProps {
  params: Promise<{
    locale: string;
    teamId: string;
  }>;
}

export default async function TeamChargingStations({
  params,
}: ChargingStationsPageProps) {
  const { teamId, locale } = await params;
  // ส่ง teamId ไปยัง ChargingStationsPage component
  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <ChargingStationsPage teamId={teamId} />
    </TeamGuard>
  );
}
