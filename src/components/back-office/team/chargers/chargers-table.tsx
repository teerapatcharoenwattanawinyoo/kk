"use client";

import { ChargerTableSkeleton } from "@/components/skeleton-components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChargersList } from "@/hooks/use-chargers";
import {
  ChargerListItem,
  EditChargerInitialValues,
  getChargerDetail,
} from "@/lib/api/team-group/charger";
import { useI18n } from "@/lib/i18n";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

interface ChargersTableProps {
  chargers: ChargerListItem[];
  isLoading: boolean;
  debouncedSearchTerm: string;
  statusFilter: string;
  clearAllFilters: () => void;
  onEditCharger: (editChargerData: EditChargerInitialValues) => void;
  onSetIntegration: (chargerId: number) => void; // Callback for Set Integration
  onDeleteCharger: (chargerId: string | number | undefined) => void; // Callback for Delete Charger
  teamId: string; // Add teamId for React Query refetch
  currentPage: string; // Add current page for proper query key
  pageSize: string; // Add page size for proper query key
}

const EmptyState = ({
  debouncedSearchTerm,
  statusFilter,
  clearAllFilters,
}: Pick<
  ChargersTableProps,
  "debouncedSearchTerm" | "statusFilter" | "clearAllFilters"
>) => (
  <div className="py-8 text-center">
    {debouncedSearchTerm || statusFilter ? (
      <div>
        <p className="mb-2 text-sm text-gray-500">
          No chargers found matching your search criteria.
        </p>
        <button
          onClick={clearAllFilters}
          className="text-xs text-blue-600 underline hover:text-blue-800"
        >
          Clear filters to see all chargers
        </button>
      </div>
    ) : (
      <p className="text-sm text-gray-500">No chargers found.</p>
    )}
  </div>
);

export function ChargersTable({
  chargers,
  isLoading,
  debouncedSearchTerm,
  statusFilter,
  clearAllFilters,
  onEditCharger,
  onSetIntegration,
  onDeleteCharger,
  teamId,
  currentPage,
  pageSize,
}: ChargersTableProps) {
  const { t } = useI18n();
  const [loadingChargerId, setLoadingChargerId] = useState<string | null>(null);

  // Use React Query hook for refetch capability with same parameters as chargers-page
  const { refetch } = useChargersList(teamId, currentPage, pageSize, {
    enableRealtime: true,
    refetchInterval: 30000,
    search: debouncedSearchTerm,
    status: statusFilter,
  });

  // Helper function to map API accessibility values to form values
  const mapApiAccessToForm = (apiAccess: string | null): string => {
    if (!apiAccess) return "";

    // Handle both string names and numeric values from API
    const access = apiAccess.toString().trim().toLowerCase();

    switch (access) {
      case "public":
      case "1":
        return "1";
      case "private":
      case "2":
        return "2";
      case "unavailable":
      case "3":
        return "3";
      default:
        console.log("Unknown accessibility value from API:", apiAccess);
        return "";
    }
  };

  // Status badge function - moved from chargers-page.tsx
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Available: {
        bgColor: "bg-[#DFF8F3]",
        textColor: "text-[#0D8A72]",
        hoverBg: "hover:bg-[#DFF8F3]",
        hoverText: "hover:text-[#0D8A72]",
      },
      Integrate: {
        bgColor: "bg-[#FFE5D1]",
        textColor: "text-[#FF9640]",
        hoverBg: "hover:bg-[#FFE5D1]",
        hoverText: "hover:text-[#FF9640]",
      },
      Charging: {
        bgColor: "bg-[#FFE5D1]",
        textColor: "text-[#FF9640]",
        hoverBg: "hover:bg-[#FFE5D1]",
        hoverText: "hover:text-[#FF9640]",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      bgColor: "bg-destructive/10",
      textColor: "text-destructive",
      hoverBg: "hover:bg-destructive/20",
      hoverText: "hover:text-destructive",
    };

    return (
      <Badge
        className={`rounded-md px-5 py-1 ${config.bgColor} ${config.textColor} ${config.hoverBg} ${config.hoverText}`}
      >
        <p className="font-medium">{status}</p>
      </Badge>
    );
  };

  // Connection button function - moved from chargers-page.tsx
  const getConnectionButton = (connection: string, charger?: unknown) => {
    if (connection === "Set Integration") {
      return (
        <Button
          size="sm"
          className="h-6 rounded-xl bg-[#FFE5D1] px-5 py-1 text-xs text-[#FF9640] hover:bg-[#FF9640] hover:text-white"
          onClick={() => handleSetIntegration(charger)}
        >
          Set Integration
        </Button>
      );
    }
    return connection;
  };

  // Set integration handler - moved from chargers-page.tsx
  const handleSetIntegration = async (charger: unknown) => {
    if (
      !charger ||
      typeof charger !== "object" ||
      !("id" in charger) ||
      typeof (charger as { id: unknown }).id !== "number"
    ) {
      console.error("Charger ID is missing or invalid");
      return;
    }

    const chargerId = (charger as { id: number }).id;
    console.log("Set Integration for charger ID:", chargerId);

    // Call onSetIntegration callback and also fetch charger details
    onSetIntegration(chargerId);

    // Fetch and open edit dialog with integration mode
    const chargerItem = chargers.find((c) => c.id === chargerId);
    if (chargerItem) {
      await handleEditCharger(chargerItem);
    }
  };

  const handleEditCharger = async (charger: ChargerListItem) => {
    if (!charger.id) return;

    setLoadingChargerId(charger.id.toString());

    try {
      console.log("Fetching charger detail for ID:", charger.id);

      // Fetch detailed charger data from API
      const response = await getChargerDetail(charger.id);
      console.log("Charger detail response:", response);

      if (response.statusCode === 200 && response.data) {
        const chargerDetail = response.data;

        // Map API accessibility values to form values
        const mappedAccessValue = mapApiAccessToForm(
          chargerDetail.aceesibility,
        );

        // Handle selectedPowerLevel - convert max_power to string with kW unit
        const powerLevelValue = chargerDetail.max_power;
        const mappedPowerLevel = powerLevelValue ? `${powerLevelValue}kW` : "";

        const mappedValues: EditChargerInitialValues = {
          id: chargerDetail.id.toString(),
          chargerName: chargerDetail.name || "",
          chargerAccess: mappedAccessValue,
          selectedBrand: chargerDetail.brand_id?.toString() || "",
          selectedModel: chargerDetail.model_id?.toString() || "",
          typeConnector: chargerDetail.charger_type || "",
          selectedPowerLevel: mappedPowerLevel,
          selectedChargingStation: chargerDetail.station_id?.toString() || "",
          serialNumber: chargerDetail.serial_number || "",
          selectedTeam: chargerDetail.team_group_id?.toString() || "",
        };

        console.log(
          "Mapped values from API for EditChargerDialog:",
          mappedValues,
        );
        onEditCharger(mappedValues);
      } else {
        console.error(
          "Failed to fetch charger details, status:",
          response.statusCode,
        );
      }
    } catch (error) {
      console.error("Error fetching charger detail:", error);
    } finally {
      setLoadingChargerId(null);
    }
  };

  return (
    <div className="-mt-8 overflow-x-auto px-4 sm:px-4">
      <Table className="min-w-full border-separate border-spacing-y-1 p-2">
        <TableHeader className="bg-primary">
          <TableRow>
            <TableHead className="rounded-tl-lg px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t("table.charger")}
            </TableHead>
            <TableHead className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t("table.charging_station")}
            </TableHead>
            <TableHead className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t("table.accessibility")}
            </TableHead>
            <TableHead className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t("table.status")}
            </TableHead>
            <TableHead className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t("table.connection")}
            </TableHead>
            <TableHead className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t("table.created")}
            </TableHead>
            <TableHead className="rounded-tr-lg px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t("table.action")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <ChargerTableSkeleton count={5} />
          ) : chargers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center">
                <EmptyState
                  debouncedSearchTerm={debouncedSearchTerm}
                  statusFilter={statusFilter}
                  clearAllFilters={clearAllFilters}
                />
              </TableCell>
            </TableRow>
          ) : (
            chargers.map((charger, idx) => (
              <ChargerRow
                key={charger.id ?? `table-charger-${idx}`}
                charger={charger}
                isLoadingChargerDetail={
                  loadingChargerId === charger.id?.toString()
                }
                getStatusBadge={getStatusBadge}
                getConnectionButton={getConnectionButton}
                setPendingEditCharger={handleEditCharger}
                handleDeleteCharger={onDeleteCharger}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface ChargerRowProps {
  charger: ChargerListItem;
  isLoadingChargerDetail: boolean;
  getStatusBadge: (status: string) => React.ReactElement;
  getConnectionButton: (
    connection: string,
    charger?: unknown,
  ) => React.ReactElement | string;
  setPendingEditCharger: (charger: ChargerListItem) => void;
  handleDeleteCharger: (chargerId: string | number | undefined) => void;
}

const ChargerRow = React.memo(function ChargerRow({
  charger,
  isLoadingChargerDetail,
  getStatusBadge,
  getConnectionButton,
  setPendingEditCharger,
  handleDeleteCharger,
}: ChargerRowProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const teamId = params?.teamId as string | undefined;
  return (
    <TableRow className="shadow-xs rounded-lg bg-background">
      <TableCell className="whitespace-nowrap rounded-l-lg px-2 py-2 text-center text-xs text-gray-900 md:px-4 md:py-3">
        <div className="flex items-center">
          <div className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-muted font-bold">
            <Image
              src="/assets/images/icons/thunder.svg"
              alt="Thunder"
              width={16}
              height={16}
              className="h-4 w-4"
            />
          </div>
          <div className="text-left">
            <div className="text-muted-blue text-xs font-medium">
              {charger.name}
            </div>
            <div className="text-muted-blue text-xs font-light">
              {charger.serial_number || "Null"}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
        <div className="inline-block rounded-xl bg-primary/10 px-3 py-1 text-primary">
          {charger.station_name}
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
        <span className="text-muted-blue">
          {charger.accessibility || "Unknown"}
        </span>
      </TableCell>
      <TableCell className="text-muted-blue whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
        {getStatusBadge(charger.status)}
      </TableCell>
      <TableCell className="text-muted-blue whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
        {getConnectionButton(charger.connection, charger)}
      </TableCell>
      <TableCell className="text-muted-blue whitespace-pre-line px-2 py-2 text-center text-xs leading-tight md:px-4 md:py-3">
        {charger.date}
        <br />
        {charger.time}
      </TableCell>
      <TableCell className="text-muted-blue whitespace-nowrap rounded-r-lg px-2 py-2 text-center text-xs md:px-4 md:py-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-[13px] w-[13px] p-0"
                disabled={isLoadingChargerDetail}
                onClick={() => setPendingEditCharger(charger)}
              >
                <Pencil className="h-[18px] w-[18px] p-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ml-4 h-[18px] w-[18px] p-0"
                onClick={() => handleDeleteCharger(charger.id)}
                aria-label="Delete"
              >
                <Trash2 className="h-[18px] w-[18px] p-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-[18px] w-[18px] p-0"
                aria-label="More"
              >
                <MoreHorizontal className="h-[18px] w-[18px] p-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => {
                  const basePath = teamId
                    ? `/${locale}/team/${teamId}/chargers`
                    : "/chargers";
                  const query = new URLSearchParams({
                    tab: "connectors",
                    charger_id: String(charger.id ?? ""),
                    page: "1",
                    pageSize: "10",
                  });
                  router.push(`${basePath}?${query.toString()}`);
                }}
              >
                Connectors
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
});
