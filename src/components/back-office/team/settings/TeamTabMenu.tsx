import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export interface TeamTabMenuProps {
  active: string;
  locale: string;
  teamId: string;
}

// ฟังก์ชันสำหรับสร้าง tab (export ได้)
export function getTeamTabs(t: (key: string) => string) {
  return [
    { value: "overview", label: t("team_tabs.overview"), path: "overview" },
    {
      value: "charging-stations",
      label: t("team_tabs.charging_stations"),
      path: "charging-stations",
    },
    { value: "chargers", label: t("team_tabs.chargers"), path: "chargers" },
    { value: "members", label: t("team_tabs.members"), path: "members" },
    {
      value: "price-groups",
      label: t("team_tabs.pricing"),
      path: "price-groups",
    },
    {
      value: "team-wallet",
      label: t("team_tabs.team_wallet"),
      path: "team-wallet",
    },
    { value: "revenue", label: t("team_tabs.revenue"), path: "revenue" },
    { value: "vehicles", label: t("team_tabs.vehicles"), path: "vehicles" },
    { value: "settings", label: t("team_tabs.settings"), path: "settings" },
  ];
}

export function TeamTabMenu({ active, locale, teamId }: TeamTabMenuProps) {
  const { t } = useI18n();
  const TEAM_TABS = getTeamTabs(t);

  return (
    <div className="flex space-x-6 overflow-x-auto rounded-lg border bg-card p-4">
      {TEAM_TABS.map((tab) => {
        const href = `/${locale}/team/${teamId}/${tab.path}`;
        return (
          <Link href={href} key={tab.value} passHref>
            <button
              className={`cursor-pointer whitespace-nowrap px-1 pb-2 text-sm font-medium transition-colors ${
                active === tab.value
                  ? "text-primary"
                  : "text-sidebar-foreground border-transparent hover:text-accent-foreground"
              }`}
              type="button"
            >
              {tab.label}
            </button>
          </Link>
        );
      })}
    </div>
  );
}
