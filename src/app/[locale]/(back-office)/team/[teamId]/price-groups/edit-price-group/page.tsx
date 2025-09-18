import { EditPriceGroup } from "@/components/back-office/team/edit";
import { TeamGuard } from "@/components/back-office/team/team-guard";
interface EditPriceGroupPageProps {
  params: Promise<{
    locale: string;
    teamId: string;
  }>;
}

export default async function EditPriceGroupPage({
  params,
}: EditPriceGroupPageProps) {
  const { teamId, locale } = await params;

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <EditPriceGroup />
    </TeamGuard>
  );
}
