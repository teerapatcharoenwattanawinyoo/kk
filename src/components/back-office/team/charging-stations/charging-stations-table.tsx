"use client";
import { StationIcon } from "@/components/icons/StationIcon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChargingStation } from "@/hooks/use-charging-stations";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface ChargingStationsTableProps {
  chargingStations: ChargingStation[];
  isLoading: boolean;
  error: Error | null;
  pageSize: number;
  onEditStation: (station: ChargingStation) => void;
  onDeleteClick: (station: ChargingStation) => void;
  formatDateTime: (date: string, time: string) => string;
}

export function ChargingStationsTable({
  chargingStations,
  isLoading,
  error,
  pageSize,
  onEditStation,
  onDeleteClick,
  formatDateTime,
}: ChargingStationsTableProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const teamId = params?.teamId as string | undefined;
  return (
    <div className="-mt-8 overflow-x-auto px-6">
      <table className="min-w-full border-separate border-spacing-y-4">
        <thead className="rounded-lg bg-primary">
          <tr>
            <th
              scope="col"
              className="rounded-tl-lg px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3"
            >
              NO
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3"
            >
              NAME
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3"
            >
              CHARGING STATIONS
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3"
            >
              CHARGERS
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3"
            >
              CONNECTORS
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3"
            >
              ACCESSIBILITY
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3"
            >
              CREATED
            </th>
            <th
              scope="col"
              className="rounded-tr-lg px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3"
            >
              ACTION
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, index) => (
              <tr
                key={`skeleton-${index}`}
                className="shadow-xs rounded-lg bg-card"
              >
                <td className="whitespace-nowrap rounded-l-lg px-2 py-2 md:px-4 md:py-3">
                  <Skeleton className="h-4 w-6" />
                </td>
                <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-2 py-2 md:px-4 md:py-3">
                  <div className="flex items-start gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">
                  <Skeleton className="h-4 w-8" />
                </td>
                <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">
                  <Skeleton className="h-4 w-8" />
                </td>
                <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">
                  <Skeleton className="h-4 w-16" />
                </td>
                <td className="whitespace-nowrap px-2 py-2 md:px-4 md:py-3">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </td>
                <td className="whitespace-nowrap rounded-r-lg px-2 py-2 md:px-4 md:py-3">
                  <div className="flex gap-1">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                </td>
              </tr>
            ))
          ) : error ? (
            <tr>
              <td colSpan={8} className="py-8 text-center text-destructive">
                Error loading charging stations. Please try again.
              </td>
            </tr>
          ) : chargingStations.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-8 text-center text-gray-500">
                No charging stations found.
              </td>
            </tr>
          ) : (
            chargingStations.map((station) => (
              <tr
                key={station.id}
                className="shadow-xs rounded-lg bg-background"
              >
                <td className="text-muted-blue whitespace-nowrap rounded-l-lg px-2 py-2 text-xs md:px-4 md:py-3">
                  {station.id}
                </td>
                <td className="text-muted-blue whitespace-nowrap px-2 py-2 text-xs font-normal md:px-4 md:py-3">
                  {station.station_name}
                </td>
                <td className="px-2 py-2 text-xs md:px-4 md:py-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-sidebar mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
                      <StationIcon />
                    </div>
                    <div className="text-muted-blue text-xs leading-snug">
                      <div className="whitespace-pre-line">
                        {station.station_detail}
                      </div>
                      <div className="whitespace-pre-line font-light">
                        {station.address}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text-muted-blue whitespace-nowrap px-2 py-2 text-xs md:px-4 md:py-3">
                  {station.chargers || "-"}
                </td>
                <td className="text-muted-blue whitespace-nowrap px-2 py-2 text-xs md:px-4 md:py-3">
                  {station.connectors || "-"}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-xs md:px-4 md:py-3">
                  <span
                    className={
                      station.aceesibility === "Publish"
                        ? "font-medium text-green-500"
                        : station.aceesibility === "Unavailable"
                          ? "font-medium text-amber-600"
                          : "text-gray-600"
                    }
                  >
                    {station.aceesibility}
                  </span>
                </td>
                <td className="text-muted-blue whitespace-pre-line px-2 py-2 text-xs leading-tight md:px-4 md:py-3">
                  {formatDateTime(station.date, station.time)}
                </td>
                <td className="text-muted-blue whitespace-nowrap rounded-r-lg px-2 py-2 text-xs md:px-4 md:py-3">
                  <div className="flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={"ghost"}
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                            onClick={() => onEditStation(station)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={"ghost"}
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                            onClick={() => onDeleteClick(station)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={"ghost"}
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem
                            onClick={() => {
                              const basePath = teamId
                                ? `/${locale}/team/${teamId}/chargers`
                                : "/chargers";
                              const query = new URLSearchParams({
                                station_id: String(station.id),
                                page: "1",
                                pageSize: "10",
                              });
                              router.push(`${basePath}?${query.toString()}`);
                            }}
                          >
                            Chargers
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipProvider>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
