"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamGroupAvatar } from "@/components/ui/team-group-avatar";
import { useTeamHostById } from "@/hooks/use-teams";
import { useI18n } from "@/lib/i18n";

interface TeamHeaderProps {
  teamId: string;
  pageTitle: string;
  icon?: React.ReactNode;
  variant?: "default" | "hero";
}

export function TeamHeader({
  teamId,
  pageTitle,
  variant = "default",
}: TeamHeaderProps) {
  const { t } = useI18n();
  const teamData = useTeamHostById(teamId);

  // Debug log
  console.log("TeamHeader Debug:", { teamId, teamData });

  // Fallback ถ้าไม่มีข้อมูล
  const displayName = teamData?.team_name || "";
  const teamImage = teamData?.team_img; // team_icon_group from API
  const teamGroupId = teamData?.team_group_id;
  const isLoading = teamData?.isLoading;

  if (variant === "hero") {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-start pb-10 pt-4">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full opacity-10">
            <Skeleton className="h-14 w-14 rounded-full" />
          </div>
          <Skeleton className="mb-1 h-6 w-32 opacity-10" />
          <Skeleton className="h-4 w-24 opacity-10" />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-start pb-10 pt-4">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full">
          <TeamGroupAvatar
            name={displayName}
            id={teamId}
            imageUrl={teamImage}
            size="xl"
            className="h-14 w-14"
          />
        </div>
        <h1 className="mb-1 text-xl font-bold">{displayName}</h1>
        <p className="text-xs text-white/70">
          {t("overview.team_id")} : {teamGroupId}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 py-4 md:px-6">
        <div className="rounded-lg bg-card p-4 md:p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full md:h-14 md:w-14" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-4 w-24" />
              {pageTitle && <Skeleton className="h-5 w-32" />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 md:px-6">
      <div className="rounded-lg border bg-card p-4 md:p-6">
        <div className="flex items-center gap-3">
          <TeamGroupAvatar
            name={displayName}
            id={teamId}
            imageUrl={teamImage}
            size="lg"
            className="h-12 w-12 md:h-14 md:w-14"
          />
          <div>
            <h1 className="text-sm font-bold text-primary md:text-sm">
              {displayName}
            </h1>
            {pageTitle && (
              <p className="text-title-onecharge text-xl font-medium">
                {pageTitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
