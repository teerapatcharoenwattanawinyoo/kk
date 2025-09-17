import { RevenueTab } from "@/components/back-office/team/revenue";
import { TeamGuard } from "@/components/back-office/team/team-guard";

interface RevenuePageProps {
  params: Promise<{
    locale: string;
    teamId: string;
  }>;
}

const RevenuePage = async ({ params }: RevenuePageProps) => {
  const { teamId, locale } = await params;
  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <RevenueTab teamId={teamId} locale={locale} />
    </TeamGuard>
  );
};

export default RevenuePage;
