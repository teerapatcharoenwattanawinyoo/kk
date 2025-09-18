"use client";

import { SettingsLayout } from "@/components/back-office/team/settings/settings-layout";
import { GeneralSettingTab } from "@/components/back-office/team/settings/tab/general-setting-tab";
import { TeamGuard } from "@/components/back-office/team/team-guard";
import { useI18n } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { use } from "react";

interface GeneralSettingsPageProps {
  params: Promise<{
    locale: string;
    teamId: string;
  }>;
}

const GeneralSettingsPage = ({ params }: GeneralSettingsPageProps) => {
  const { t } = useI18n();
  const { locale, teamId } = use(params);
  const router = useRouter();

  const handleCancel = () => {
    // Go back to team overview
    router.push(`/${locale}/team/${teamId}/overview`);
  };

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <SettingsLayout
        teamId={teamId}
        locale={locale}
        title={t("team_tabs.settings")}
      >
        <div className="p-4 lg:p-6">
          <GeneralSettingTab teamId={teamId} onCancel={handleCancel} />
        </div>
      </SettingsLayout>
    </TeamGuard>
  );
};

export default GeneralSettingsPage;
