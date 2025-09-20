'use client'
import { type ChargingStation } from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations'
import { StationIcon } from '@/components/icons/StationIcon'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Edit, Eye, EyeClosed, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

interface ChargingStationsTableProps {
  chargingStations: ChargingStation[]
  isLoading: boolean
  error: Error | null
  pageSize: number
  onEditStation: (station: ChargingStation) => void
  onDeleteClick: (station: ChargingStation) => void
  formatDateTime: (date: string, time: string) => string
}

/**
 * Small, focused subcomponents keep the main render short & readable
 */
function TableHeader() {
  const th = (label: string, extra = '') => (
    <th
      scope="col"
      className={`px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3 ${extra}`}
    >
      {label}
    </th>
  )
  return (
    <thead className="rounded-lg bg-primary">
      <tr>
        {th('NO', 'rounded-tl-lg')}
        {th('NAME')}
        {th('CHARGING STATIONS')}
        {th('CHARGERS')}
        {th('CONNECTORS')}
        {th('ACCESSIBILITY')}
        {th('CREATED')}
        {th('ACTION', 'rounded-tr-lg')}
      </tr>
    </thead>
  )
}

function SkeletonRow({ index }: { index: number }) {
  return (
    <tr key={`skeleton-${index}`} className="shadow-xs rounded-lg bg-card">
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
  )
}

function StationInfoCell({ station }: { station: ChargingStation }) {
  return (
    <div className="flex items-start gap-2">
      <div className="bg-sidebar mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
        <StationIcon />
      </div>
      <div className="text-oc-sidebar text-xs leading-snug">
        <div className="whitespace-pre-line">{station.station_detail}</div>
        <div className="whitespace-pre-line font-light">{station.address}</div>
      </div>
    </div>
  )
}

function StatusBadge({ value }: { value: string }) {
  const cls =
    value === 'Publish'
      ? 'font-medium text-green-500'
      : value === 'Unavailable'
        ? 'font-medium text-amber-600'
        : 'text-gray-600'
  return <span className={cls}>{value}</span>
}

function ActionButtons({
  station,
  onEditStation,
  onDeleteClick,
  navigateToChargers,
}: {
  station: ChargingStation
  onEditStation: (s: ChargingStation) => void
  onDeleteClick: (s: ChargingStation) => void
  navigateToChargers: (s: ChargingStation) => void
}) {
  return (
    <div className="flex gap-1">
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={'ghost'}
                size="sm"
                className="group h-6 w-6 p-0"
                aria-label="View Chargers"
              >
                <span className="group-hover:hidden">
                  <EyeClosed className="h-3 w-3" />
                </span>
                <span className="hidden group-hover:inline">
                  <Eye className="h-3 w-3" />
                </span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>View Chargers</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem onClick={() => navigateToChargers(station)}>Chargers</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={'ghost'}
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onEditStation(station)}
            aria-label="Edit"
          >
            <Edit className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={'ghost'}
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onDeleteClick(station)}
            aria-label="Delete"
          >
            <Trash className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
    </div>
  )
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
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const teamId = params?.teamId as string | undefined

  const navigateToChargers = (station: ChargingStation) => {
    const basePath = teamId ? `/${locale}/team/${teamId}/chargers` : '/chargers'
    const query = new URLSearchParams({
      station_id: String(station.id),
      page: '1',
      pageSize: '10',
    })
    router.push(`${basePath}?${query.toString()}`)
  }

  return (
    <div className="-mt-8 overflow-x-auto px-6">
      <TooltipProvider>
        <table className="min-w-full border-separate border-spacing-y-4">
          <TableHeader />
          <tbody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <SkeletonRow key={index} index={index} />
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
                <tr key={station.id} className="shadow-xs rounded-lg bg-background">
                  <td className="text-oc-sidebar whitespace-nowrap rounded-l-lg px-2 py-2 text-xs md:px-4 md:py-3">
                    {station.id}
                  </td>
                  <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-xs font-normal md:px-4 md:py-3">
                    {station.station_name}
                  </td>
                  <td className="px-2 py-2 text-xs md:px-4 md:py-3">
                    <StationInfoCell station={station} />
                  </td>
                  <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-xs md:px-4 md:py-3">
                    {station.chargers || '-'}
                  </td>
                  <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-xs md:px-4 md:py-3">
                    {station.connectors || '-'}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-xs md:px-4 md:py-3">
                    <StatusBadge value={station.aceesibility} />
                  </td>
                  <td className="text-oc-sidebar whitespace-pre-line px-2 py-2 text-xs leading-tight md:px-4 md:py-3">
                    {formatDateTime(station.date, station.time)}
                  </td>
                  <td className="text-oc-sidebar whitespace-nowrap rounded-r-lg px-2 py-2 text-xs md:px-4 md:py-3">
                    <ActionButtons
                      station={station}
                      onEditStation={onEditStation}
                      onDeleteClick={onDeleteClick}
                      navigateToChargers={navigateToChargers}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TooltipProvider>
    </div>
  )
}
