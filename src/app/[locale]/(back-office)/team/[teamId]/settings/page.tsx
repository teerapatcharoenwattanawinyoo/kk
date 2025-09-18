"use client";

import FetchLoader from "@/components/FetchLoader";
import { TeamGuard } from "@/components/back-office/team/team-guard";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

interface TeamSettingsPageProps {
  params: Promise<{
    locale: string;
    teamId: string;
  }>;
}

const TeamSettingsPage = ({ params }: TeamSettingsPageProps) => {
  const { locale, teamId } = use(params);
  const router = useRouter();

  useEffect(() => {
    // Redirect to general settings by default
    router.replace(`/${locale}/team/${teamId}/settings/general`);
  }, [locale, teamId, router]);

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <div className="flex h-full items-center justify-center bg-background">
        <FetchLoader />
      </div>
    </TeamGuard>
  );
};

export default TeamSettingsPage;
