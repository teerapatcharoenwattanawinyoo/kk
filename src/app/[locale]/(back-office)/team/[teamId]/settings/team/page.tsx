"use client";

import { DevelopmentPlaceholder } from "@/components/back-office/team/settings/development-placeholder";
import { SettingsLayout } from "@/components/back-office/team/settings/settings-layout";
import { TeamGuard } from "@/components/back-office/team/team-guard";
import { use } from "react";

interface TeamSettingPageProps {
  params: Promise<{
    locale: string;
    teamId: string;
  }>;
}

const TeamSettingPage = ({ params }: TeamSettingPageProps) => {
  const { locale, teamId } = use(params);

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <SettingsLayout teamId={teamId} locale={locale} title="Setting">
        <div className="mx-auto max-w-4xl p-6">
          <DevelopmentPlaceholder title="Team Setting" />
        </div>
      </SettingsLayout>
    </TeamGuard>
  );
};

export default TeamSettingPage;
