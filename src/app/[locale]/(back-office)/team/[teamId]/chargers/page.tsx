import { ChargersPage } from "@/components/back-office/team/chargers/chargers-page";
import { TeamGuard } from "@/components/back-office/team/team-guard";

export default async function TeamChargersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; teamId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { teamId, locale } = await params;
  const { page = "1", pageSize = "10" } = await searchParams;
  const pageStr = Array.isArray(page) ? page[0] : page;
  const pageSizeStr = Array.isArray(pageSize) ? pageSize[0] : pageSize;

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <ChargersPage
        teamId={teamId}
        locale={locale}
        page={pageStr}
        pageSize={pageSizeStr}
      />
    </TeamGuard>
  );
}
