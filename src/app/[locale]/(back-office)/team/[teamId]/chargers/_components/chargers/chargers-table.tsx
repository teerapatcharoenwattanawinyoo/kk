'use client'

import type {
  ChargerListItem,
  EditChargerInitialValues,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_schemas/chargers.schema'
import { ChargerTableSkeleton } from '@/components/skeleton-components'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Eye, EyeClosed, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'

import {
  useChargersTableController,
  type ConnectionDisplay,
  type StatusBadgeConfig,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_hooks/use-chargers-table'

interface ChargersTableProps {
  chargers: ChargerListItem[]
  isLoading: boolean
  debouncedSearchTerm: string
  statusFilter: string
  clearAllFilters: () => void
  onEditCharger: (editChargerData: EditChargerInitialValues) => void
  onSetIntegration: (chargerId: number) => void
  onDeleteCharger: (chargerId: string | number | undefined) => void
}

const EmptyState = ({
  debouncedSearchTerm,
  statusFilter,
  clearAllFilters,
}: Pick<ChargersTableProps, 'debouncedSearchTerm' | 'statusFilter' | 'clearAllFilters'>) => (
  <div className="py-8 text-center">
    {debouncedSearchTerm || statusFilter ? (
      <div>
        <p className="mb-2 text-sm text-gray-500">No chargers found matching your search criteria.</p>
        <button onClick={clearAllFilters} className="text-xs text-blue-600 underline hover:text-blue-800">
          Clear filters to see all chargers
        </button>
      </div>
    ) : (
      <p className="text-sm text-gray-500">No chargers found.</p>
    )}
  </div>
)

export function ChargersTable({
  chargers,
  isLoading,
  debouncedSearchTerm,
  statusFilter,
  clearAllFilters,
  onEditCharger,
  onSetIntegration,
  onDeleteCharger,
}: ChargersTableProps) {
  const controller = useChargersTableController({ onEditCharger, onSetIntegration })
  const {
    i18n: { t },
    loadingChargerId,
    getStatusBadgeConfig,
    getConnectionDisplay,
    openEditDialog,
  } = controller

  return (
    <div className="-mt-8 overflow-x-auto px-4 sm:px-4">
      <Table className="min-w-full border-separate border-spacing-y-1 p-2">
        <TableHeader className="bg-primary">
          <TableRow>
            <TableHead className="rounded-tl-lg px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('table.charger')}
            </TableHead>
            <TableHead className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('table.charging_station')}
            </TableHead>
            <TableHead className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('table.accessibility')}
            </TableHead>
            <TableHead className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('table.status')}
            </TableHead>
            <TableHead className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('table.connection')}
            </TableHead>
            <TableHead className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('table.created')}
            </TableHead>
            <TableHead className="rounded-tr-lg px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('table.action')}
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
                isLoadingChargerDetail={loadingChargerId === charger.id?.toString()}
                statusConfig={getStatusBadgeConfig(charger.status)}
                connectionDisplay={getConnectionDisplay(charger)}
                onEdit={() => {
                  void openEditDialog(charger)
                }}
                onDelete={onDeleteCharger}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

interface ChargerRowProps {
  charger: ChargerListItem
  isLoadingChargerDetail: boolean
  statusConfig: StatusBadgeConfig
  connectionDisplay: ConnectionDisplay
  onEdit: () => void
  onDelete: (chargerId: string | number | undefined) => void
}

const ChargerRow = React.memo(function ChargerRow({
  charger,
  isLoadingChargerDetail,
  statusConfig,
  connectionDisplay,
  onEdit,
  onDelete,
}: ChargerRowProps) {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const teamId = params?.teamId as string | undefined
  const [isHoveringMore, setIsHoveringMore] = useState(false)

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
            <div className="text-oc-title text-xs font-medium">{charger.name}</div>
            <div className="text-oc-title text-xs font-light">{charger.serial_number || 'Null'}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
        <div className="inline-block rounded-xl bg-primary/10 px-3 py-1 text-primary">{charger.station_name}</div>
      </TableCell>
      <TableCell className="whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
        <span className="text-oc-sidebar">{charger.accessibility || 'Unknown'}</span>
      </TableCell>
      <TableCell className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
        <Badge
          className={`rounded-md px-5 py-1 ${statusConfig.badgeClass} ${statusConfig.textClass}`}
        >
          <p className="font-medium">{charger.status}</p>
        </Badge>
      </TableCell>
      <TableCell className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
        {connectionDisplay.type === 'action' ? (
          <Button
            size="sm"
            className="h-6 rounded-xl bg-[#FFE5D1] px-5 py-1 text-xs text-[#FF9640] hover:bg-[#FF9640] hover:text-white"
            onClick={connectionDisplay.onClick}
          >
            {connectionDisplay.label}
          </Button>
        ) : (
          connectionDisplay.value
        )}
      </TableCell>
      <TableCell className="text-oc-sidebar whitespace-pre-line px-2 py-2 text-center text-xs leading-tight md:px-4 md:py-3">
        {charger.date}
        <br />
        {charger.time}
      </TableCell>
      <TableCell className="text-oc-sidebar whitespace-nowrap rounded-r-lg px-2 py-2 text-center text-xs md:px-4 md:py-3">
        <TooltipProvider delayDuration={200}>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 mr-3 h-[18px] w-[18px] p-0"
                    aria-label="More"
                    onMouseEnter={() => setIsHoveringMore(true)}
                    onMouseLeave={() => setIsHoveringMore(false)}
                  >
                    {isHoveringMore ? <Eye className="h-[18px] w-[18px] p-0" /> : <EyeClosed className="h-[18px] w-[18px] p-0" />}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">View Connectors</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => {
                  const basePath = teamId ? `/${locale}/team/${teamId}/chargers` : '/chargers'
                  const query = new URLSearchParams({
                    tab: 'connectors',
                    charger_id: String(charger.id ?? ''),
                    page: '1',
                    pageSize: '10',
                  })
                  router.push(`${basePath}?${query.toString()}`)
                }}
              >
                Connectors
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-[13px] w-[13px] p-0"
                disabled={isLoadingChargerDetail}
                onClick={onEdit}
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
                onClick={() => onDelete(charger.id)}
                aria-label="Delete"
              >
                <Trash2 className="h-[18px] w-[18px] p-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  )
})
