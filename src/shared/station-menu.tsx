"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocale } from "@/hooks/use-locale";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface StationMenuProps {
  isMenuCollapsed: boolean;
}

export function StationMenu({ isMenuCollapsed }: StationMenuProps) {
  const [isStationMenuOpen, setIsStationMenuOpen] = useState(true);
  const pathname = usePathname();
  const { t } = useI18n();
  const { localizePath } = useLocale();

  const toggleStationMenu = useCallback(() => {
    setIsStationMenuOpen(!isStationMenuOpen);
  }, [isStationMenuOpen]);

  const isActive = useCallback(
    (path: string) => {
      const localizedPath = localizePath(path);
      if (path === "/dashboard") {
        return pathname === localizedPath;
      }
      return pathname.startsWith(localizedPath);
    },
    [pathname, localizePath],
  );

  return (
    <div className={cn(isMenuCollapsed ? "w-10" : "w-full")}>
      {isMenuCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleStationMenu}
              className={cn(
                "flex items-center rounded-lg transition-colors",
                isMenuCollapsed
                  ? "h-12 w-12 justify-center p-0"
                  : "w-full justify-between px-3 py-3",
                isActive("/station") ||
                  isActive("/charger") ||
                  isActive("/connector")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-3",
                  isMenuCollapsed ? "justify-center" : "",
                )}
              >
                <svg
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0"
                >
                  <path
                    d="M20.0156 5.49219C20.0156 5.69531 19.9648 5.875 19.8633 6.03125C19.7617 6.1875 19.625 6.30469 19.4531 6.38281L10.4531 10.8828C10.3906 10.9297 10.3203 10.9609 10.2422 10.9766C10.1641 10.9922 10.0859 11 10.0078 11C9.92969 11 9.85156 10.9922 9.77344 10.9766C9.69531 10.9609 9.625 10.9297 9.5625 10.8828L0.5625 6.38281C0.390625 6.30469 0.253906 6.1875 0.152344 6.03125C0.0507812 5.875 0 5.69531 0 5.49219C0 5.30469 0.0507812 5.13281 0.152344 4.97656C0.253906 4.82031 0.390625 4.69531 0.5625 4.60156L9.5625 0.101562C9.625 0.0703125 9.69531 0.046875 9.77344 0.03125C9.85156 0.015625 9.92969 0.0078125 10.0078 0.0078125C10.0859 0.0078125 10.1641 0.015625 10.2422 0.03125C10.3203 0.046875 10.3906 0.0703125 10.4531 0.101562L19.4531 4.60156C19.625 4.69531 19.7617 4.82031 19.8633 4.97656C19.9648 5.13281 20.0156 5.30469 20.0156 5.49219ZM10.4531 19.8828L19.4531 15.3828C19.625 15.3047 19.7617 15.1875 19.8633 15.0312C19.9648 14.875 20.0156 14.6953 20.0156 14.4922C20.0156 14.2266 19.918 13.9961 19.7227 13.8008C19.5273 13.6055 19.2891 13.5078 19.0078 13.5078C18.9297 13.5078 18.8516 13.5156 18.7734 13.5312C18.6953 13.5469 18.625 13.5703 18.5625 13.6016L10.0078 17.8906L1.45312 13.6016C1.39062 13.5703 1.32031 13.5469 1.24219 13.5312C1.16406 13.5156 1.08594 13.5078 1.00781 13.5078C0.726562 13.5078 0.488281 13.6055 0.292969 13.8008C0.0976563 13.9961 0 14.2266 0 14.4922C0 14.6953 0.0507812 14.875 0.152344 15.0312C0.253906 15.1875 0.390625 15.3047 0.5625 15.3828L9.5625 19.8828C9.625 19.9297 9.69531 19.9609 9.77344 19.9766C9.85156 19.9922 9.92969 20 10.0078 20C10.0859 20 10.1641 19.9922 10.2422 19.9766C10.3203 19.9609 10.3906 19.9297 10.4531 19.8828ZM10.4531 15.3828L19.4531 10.8828C19.625 10.8047 19.7617 10.6875 19.8633 10.5312C19.9648 10.375 20.0156 10.1953 20.0156 9.99219C20.0156 9.72656 19.918 9.49609 19.7227 9.30078C19.5273 9.10547 19.2891 9.00781 19.0078 9.00781C18.9297 9.00781 18.8516 9.01562 18.7734 9.03125C18.6953 9.04688 18.625 9.07031 18.5625 9.10156L10.0078 13.3906L1.45312 9.10156C1.39062 9.07031 1.32031 9.04688 1.24219 9.03125C1.16406 9.01562 1.08594 9.00781 1.00781 9.00781C0.726562 9.00781 0.488281 9.10547 0.292969 9.30078C0.0976563 9.49609 0 9.72656 0 9.99219C0 10.1953 0.0507812 10.375 0.152344 10.5312C0.253906 10.6875 0.390625 10.8047 0.5625 10.8828L9.5625 15.3828C9.625 15.4297 9.69531 15.4609 9.77344 15.4766C9.85156 15.4922 9.92969 15.5 10.0078 15.5C10.0859 15.5 10.1641 15.4922 10.2422 15.4766C10.3203 15.4609 10.3906 15.4297 10.4531 15.3828Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {t("navigation.station_charger_connector")}
          </TooltipContent>
        </Tooltip>
      ) : (
        <button
          onClick={toggleStationMenu}
          className={cn(
            "flex items-center rounded-lg transition-colors",
            isMenuCollapsed
              ? "h-12 w-12 justify-center p-0"
              : "w-full justify-between px-3 py-3",
            isActive("/station") ||
              isActive("/charger") ||
              isActive("/connector")
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-3",
              isMenuCollapsed ? "justify-center" : "",
            )}
          >
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 shrink-0"
            >
              <path
                d="M20.0156 5.49219C20.0156 5.69531 19.9648 5.875 19.8633 6.03125C19.7617 6.1875 19.625 6.30469 19.4531 6.38281L10.4531 10.8828C10.3906 10.9297 10.3203 10.9609 10.2422 10.9766C10.1641 10.9922 10.0859 11 10.0078 11C9.92969 11 9.85156 10.9922 9.77344 10.9766C9.69531 10.9609 9.625 10.9297 9.5625 10.8828L0.5625 6.38281C0.390625 6.30469 0.253906 6.1875 0.152344 6.03125C0.0507812 5.875 0 5.69531 0 5.49219C0 5.30469 0.0507812 5.13281 0.152344 4.97656C0.253906 4.82031 0.390625 4.69531 0.5625 4.60156L9.5625 0.101562C9.625 0.0703125 9.69531 0.046875 9.77344 0.03125C9.85156 0.015625 9.92969 0.0078125 10.0078 0.0078125C10.0859 0.0078125 10.1641 0.015625 10.2422 0.03125C10.3203 0.046875 10.3906 0.0703125 10.4531 0.101562L19.4531 4.60156C19.625 4.69531 19.7617 4.82031 19.8633 4.97656C19.9648 5.13281 20.0156 5.30469 20.0156 5.49219ZM10.4531 19.8828L19.4531 15.3828C19.625 15.3047 19.7617 15.1875 19.8633 15.0312C19.9648 14.875 20.0156 14.6953 20.0156 14.4922C20.0156 14.2266 19.918 13.9961 19.7227 13.8008C19.5273 13.6055 19.2891 13.5078 19.0078 13.5078C18.9297 13.5078 18.8516 13.5156 18.7734 13.5312C18.6953 13.5469 18.625 13.5703 18.5625 13.6016L10.0078 17.8906L1.45312 13.6016C1.39062 13.5703 1.32031 13.5469 1.24219 13.5312C1.16406 13.5156 1.08594 13.5078 1.00781 13.5078C0.726562 13.5078 0.488281 13.6055 0.292969 13.8008C0.0976563 13.9961 0 14.2266 0 14.4922C0 14.6953 0.0507812 14.875 0.152344 15.0312C0.253906 15.1875 0.390625 15.3047 0.5625 15.3828L9.5625 19.8828C9.625 19.9297 9.69531 19.9609 9.77344 19.9766C9.85156 19.9922 9.92969 20 10.0078 20C10.0859 20 10.1641 19.9922 10.2422 19.9766C10.3203 19.9609 10.3906 19.9297 10.4531 19.8828ZM10.4531 15.3828L19.4531 10.8828C19.625 10.8047 19.7617 10.6875 19.8633 10.5312C19.9648 10.375 20.0156 10.1953 20.0156 9.99219C20.0156 9.72656 19.918 9.49609 19.7227 9.30078C19.5273 9.10547 19.2891 9.00781 19.0078 9.00781C18.9297 9.00781 18.8516 9.01562 18.7734 9.03125C18.6953 9.04688 18.625 9.07031 18.5625 9.10156L10.0078 13.3906L1.45312 9.10156C1.39062 9.07031 1.32031 9.04688 1.24219 9.03125C1.16406 9.01562 1.08594 9.00781 1.00781 9.00781C0.726562 9.00781 0.488281 9.10547 0.292969 9.30078C0.0976563 9.49609 0 9.72656 0 9.99219C0 10.1953 0.0507812 10.375 0.152344 10.5312C0.253906 10.6875 0.390625 10.8047 0.5625 10.8828L9.5625 15.3828C9.625 15.4297 9.69531 15.4609 9.77344 15.4766C9.85156 15.4922 9.92969 15.5 10.0078 15.5C10.0859 15.5 10.1641 15.4922 10.2422 15.4766C10.3203 15.4609 10.3906 15.4297 10.4531 15.3828Z"
                fill="currentColor"
              />
            </svg>
            {!isMenuCollapsed && (
              <span className="max-w-[150px] truncate text-sm font-medium">
                {t("navigation.station_charger_connector")}
              </span>
            )}
          </div>
          {!isMenuCollapsed && (
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isStationMenuOpen ? "rotate-180" : "",
              )}
            />
          )}
        </button>
      )}
      {isStationMenuOpen && !isMenuCollapsed && (
        <div className="ml-8 mt-1 flex flex-col gap-1">
          <Link
            href={localizePath("/station")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-6 py-2 text-sm transition-colors",
              isActive("/station") && !isActive("/station/charger")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            )}
          >
            <span className="max-w-[120px] truncate">
              {t("common.stations")}
            </span>
          </Link>
          <Link
            href={localizePath("/station/charger")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-6 py-2 text-sm transition-colors",
              isActive("/station/charger") &&
                !isActive("/station/charger/connector")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            )}
          >
            <span className="max-w-[120px] truncate">
              {t("common.chargers")}
            </span>
          </Link>
          <Link
            href={localizePath("/station/charger/connector")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-6 py-2 text-sm transition-colors",
              isActive("/station/charger/connector")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            )}
          >
            <span className="max-w-[120px] truncate">
              {t("common.connector")}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
