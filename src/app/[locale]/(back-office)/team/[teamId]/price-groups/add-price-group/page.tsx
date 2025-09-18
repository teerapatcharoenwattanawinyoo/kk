import { AddPriceGroup } from "@/components/back-office/team/add/";
import { TeamGuard } from "@/components/back-office/team/team-guard";

interface AddPriceGroupPageProps {
  params: Promise<{
    locale: string;
    teamId: string;
  }>;
}

export default async function AddPriceGroupPage({
  params,
}: AddPriceGroupPageProps) {
  const { teamId, locale } = await params;

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <AddPriceGroup />
    </TeamGuard>
  );
}
