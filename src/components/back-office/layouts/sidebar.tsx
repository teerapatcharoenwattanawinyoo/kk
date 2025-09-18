"use client";

import { OneChargeHeader, OneChargeLogoSecondary } from "@/components/icons";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as UISidebar,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLocale } from "@/hooks/use-locale";
import { useI18n } from "@/lib/i18n";
import { ArrowDownUp, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const { state, isMobile } = useSidebar();
  const pathname = usePathname();
  const { localizePath } = useLocale();
  const { t } = useI18n();

  const isActive = (path: string) => {
    const localizedPath = localizePath(path);
    if (path === "/dashboard") {
      return pathname === localizedPath;
    }
    return pathname.startsWith(localizedPath);
  };

  const menuItems = [
    {
      path: "/dashboard",
      labelKey: "common.dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      path: "/team",
      labelKey: "common.team",
      href: localizePath("/team?page=1&pageSize=10"),
      icon: <Users className="h-4 w-4" />,
    },
    {
      path: "/transaction",
      labelKey: "common.transaction",
      icon: <ArrowDownUp className="h-4 w-4" />,
    },
  ];

  return (
    <UISidebar collapsible="icon">
      <SidebarHeader className="px-4 py-4">
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-primary data-[state=open]:text-primary"
        >
          {state === "collapsed" && !isMobile ? (
            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 font-semibold"
                aria-label="OneCharge Dashboard"
              >
                <OneChargeLogoSecondary width={24} height={24} />
              </Link>
            </div>
          ) : (
            <div className="flex w-full items-center">
              <div className="h-7 w-auto">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 font-semibold"
                  aria-label="OneCharge Dashboard"
                >
                  <OneChargeHeader />
                </Link>
              </div>
            </div>
          )}
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="px-2">
        {/* Menu group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={t(item.labelKey)}
                    className="data-[active=true]:bg-primary-soft/70 data-[active=true]:hover:bg-primary-soft/70 data-[active=true]:text-primary data-[active=true]:hover:text-primary"
                  >
                    <Link href={item.href || localizePath(item.path)}>
                      {item.icon}
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </UISidebar>
  );
}
