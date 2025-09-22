'use client'

import {
  ConnectorListItem,
  getConnectorDetail,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_servers/connectors'
import { ConnectorTableSkeleton } from '@/components/skeleton-components'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useI18n } from '@/lib/i18n'
import { Pen, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { QrPreviewDialog } from './qr-preview-dialog'

interface ConnectorsTableProps {
  connectors: ConnectorListItem[]
  isConnectorsLoading: boolean
  connectorsError: Error | null
  debouncedSearchTerm: string
  statusFilter: string
  clearAllFilters: () => void
  setSelectedConnectorForPricing: (connector: ConnectorListItem) => void
  setsetPriceDialogFromTableOpen: (open: boolean) => void
  handleEditConnector: (connector: ConnectorListItem) => void
  handleDeleteConnector: (connectorId: string | number | undefined) => void
}

export function ConnectorsTable({
  connectors,
  isConnectorsLoading,
  connectorsError,
  debouncedSearchTerm,
  statusFilter,
  clearAllFilters,
  setSelectedConnectorForPricing,
  setsetPriceDialogFromTableOpen,
  handleEditConnector,
  handleDeleteConnector,
}: ConnectorsTableProps) {
  const { t } = useI18n()

  const handleConnectorIdClick = async (connectorId: number) => {
    try {
      const response = await getConnectorDetail(connectorId)

      // Show success toast with connector name or ID
      const connectorName = response.data.connector_name || `ID: ${connectorId}`
      toast.success(`Loaded details for connector: ${connectorName}`)

      // Additional UI handling can be added here
    } catch (error) {
      console.error('Error fetching connector detail:', error)
      toast.error('Failed to load connector details')
    }
  }

  const EmptyState = ({ colSpan }: { colSpan: number }) => (
    <tr>
      <td colSpan={colSpan} className="py-8 text-center">
        {debouncedSearchTerm || statusFilter ? (
          <div>
            <p className="mb-2 text-sm text-gray-500">
              No connectors found matching your search criteria.
            </p>
            <button
              onClick={clearAllFilters}
              className="text-xs text-blue-600 underline hover:text-blue-800"
            >
              Clear filters to see all connectors
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No connectors found.</p>
        )}
      </td>
    </tr>
  )

  const getStatusChargeDisplay = (status: string) => {
    const statusConfig = {
      Available: {
        bgColor: 'bg-[#DFF8F3] dark:bg-[#0D8A72]/10',
        textColor: 'text-[#0D8A72] dark:text-green-400',
        label: 'Online',
      },
      Charging: {
        bgColor: 'bg-[#FFE5D1] dark:bg-[#FF9640]/10',
        textColor: 'text-[#FF9640] dark:text-[#FF9640]',
        label: 'Charging',
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      bgColor: 'bg-destructive/10',
      textColor: 'text-destructive',
      label: status,
    }

    return (
      <span className={`rounded px-3 py-1 ${config.bgColor} ${config.textColor}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="-mt-8 overflow-x-auto px-4 sm:px-4">
      <table className="min-w-full border-separate border-spacing-y-1 p-2">
        <thead className="rounded-lg bg-primary">
          <tr>
            <th className="rounded-tl-lg px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('connectors.table.chargers')}
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('connectors.table.charging_stations')}
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('connectors.table.connector_id')}
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('connectors.table.type')}
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('connectors.table.qr_code')}
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('connectors.table.pricing')}
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('connectors.table.status_charge')}
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('connectors.table.status')}
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('connectors.table.created')}
            </th>
            <th className="rounded-tr-lg px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground md:px-4 md:py-3">
              {t('connectors.table.action')}
            </th>
          </tr>
        </thead>
        <tbody>
          {isConnectorsLoading ? (
            <ConnectorTableSkeleton count={5} />
          ) : connectorsError ? (
            <tr>
              <td colSpan={10} className="py-8 text-center">
                <p className="text-sm text-destructive">
                  Failed to load connectors. Please try again.
                </p>
              </td>
            </tr>
          ) : connectors.length === 0 ? (
            <EmptyState colSpan={10} />
          ) : (
            connectors.map((connector) => (
              <tr key={connector.id} className="shadow-xs rounded-lg bg-background">
                <td className="text-oc-sidebar whitespace-nowrap rounded-l-lg px-2 py-2 text-center text-xs md:px-4 md:py-3">
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
                      <div className="text-oc-sidebar text-xs font-medium">
                        {connector.name || 'Null'}
                      </div>
                      <div className="text-oc-sidebar text-xs font-light">
                        {connector.serial_number || 'Null'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                  <div className="inline-block rounded-xl bg-primary/10 px-3 py-1 text-primary">
                    {connector.station_name}
                  </div>
                </td>
                <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                  {connector.id}
                </td>
                <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                  {connector.type}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                  {connector.qr && connector.qr !== 'null' && connector.qr !== '' ? (
                    <QrPreviewDialog
                      qrUrl={connector.qr}
                      connectorName={connector.name || undefined}
                      connectorId={connector.id}
                    >
                      <span className="inline-block align-middle">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant={'ghost'}
                                aria-label="Preview QR code"
                                className="cursor-pointer appearance-none bg-transparent p-0 transition-transform hover:scale-105"
                              >
                                <Image
                                  src={connector.qr}
                                  alt="QR Code"
                                  width={42}
                                  height={42}
                                  loading="lazy"
                                  decoding="async"
                                  className="mx-auto size-8 select-none rounded-[4px] border-2 border-primary [image-rendering:pixelated] hover:border-primary/80"
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" sideOffset={6}>
                              <div className="text-xs">{`Preview`}</div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>
                    </QrPreviewDialog>
                  ) : (
                    <span className="text-xs text-gray-400">No QR</span>
                  )}
                </td>
                <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                  {connector.pricing !== 'Set Price' ? (
                    connector.pricing
                  ) : (
                    <Button
                      variant="default"
                      className="h-5 rounded-xl bg-zinc-950 py-3 text-[10px] text-primary-foreground transition duration-150 hover:scale-105 hover:bg-zinc-700 sm:h-5 sm:text-[10px]"
                      onClick={() => {
                        setSelectedConnectorForPricing(connector)
                        setsetPriceDialogFromTableOpen(true)
                      }}
                    >
                      {t('buttons.set-price')}
                    </Button>
                  )}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                  {getStatusChargeDisplay(connector.status)}
                </td>
                <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                  {connector.status}
                </td>
                <td className="text-oc-sidebar whitespace-pre-line px-2 py-2 text-center text-xs leading-tight md:px-4 md:py-3">
                  {connector.date}
                  <br />
                  {connector.time}
                </td>
                <td className="text-oc-sidebar whitespace-nowrap rounded-r-lg px-2 py-2 text-center text-xs md:px-4 md:py-3">
                  <div className="flex items-center justify-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-[13px] w-[13px] p-4"
                            onClick={() => handleEditConnector(connector)}
                          >
                            <Pen />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t('buttons.edit')}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-[13px] w-[13px] p-4"
                            onClick={() => handleDeleteConnector(connector.id)}
                            aria-label="Delete connector"
                          >
                            <Trash2 className="h-[10px] w-[10px]" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t('buttons.delete')}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
