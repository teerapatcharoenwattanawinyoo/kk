'use client'

import {
  ChargersTable,
  OcppUrlDialog,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_components/chargers'
import { ConnectorsTable } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_components/connectors'
import { useChargersPageController } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_hooks/use-chargers-page'
import { TeamHeader } from '@/app/[locale]/(back-office)/team/_components/team-header'
import { DeleteConfirmDialog } from '@/components/notifications'
import { SetPriceDialog, SetPriceDialogFormTable } from '@/components/back-office/team/set-price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Plus, Search, X } from 'lucide-react'

import { TeamTabMenu } from '@/app/[locale]/(back-office)/team/_components/team-tab-menu'
import { AddChargerDialog } from '../chargers/add-charger-dialog'
import EditChargerDialog from '../chargers/edit-charger-dialog'
import AddConnectorDialog from '../connectors/add-connector-dialog'
import EditConnectorDialog from '../connectors/edit-connector-dialog'
import type { ConnectorSelectItem } from '../../_servers/connectors'

interface ChargersPageProps {
  teamId: string
  locale: string
  page?: string
  pageSize?: string
}

export function ChargersPage({ teamId, locale, page, pageSize }: ChargersPageProps) {
  const {
    i18n: { t },
    tabs: { active: activeTab, setActive: setActiveTab },
    filters: {
      searchTerm,
      debouncedSearchTerm,
      statusFilter,
      onSearchChange,
      onStatusFilterChange,
      clearAll,
      clearSearch,
      clearStatus,
    },
    pagination: {
      currentPageNum,
      pageSizeNum,
      data: paginationData,
      onPageChange,
      onPageSizeChange,
    },
    chargers: { items: chargers, isLoading },
    connectors: { items: connectors, isLoading: isConnectorsLoading, error: connectorsError },
    dialogs: {
      addCharger,
      addConnector,
      editConnector,
      editCharger,
      deleteConfirm,
    },
    pricing: {
      fromTableOpen: isPriceDialogFromTableOpen,
      onFromTableOpenChange: onPriceDialogFromTableChange,
      dialogOpen: isPriceDialogOpen,
      onDialogOpenChange: onPriceDialogOpenChange,
      selectedConnector,
      setSelectedConnector,
    },
    ocpp: {
      dialogOpen: ocppDialogOpen,
      setDialogOpen: setOcppDialogOpen,
      url: ocppUrl,
      setUrl: setOcppUrl,
      inputRef: ocppUrlInputRef,
    },
    actions: {
      onEditCharger,
      onSetIntegration,
      onDeleteCharger,
      onEditConnector,
      onDeleteConnector,
      onConfirmDelete,
    },
    deletion: { isDeleting, target: deleteTarget },
  } = useChargersPageController({ teamId, page, pageSize })

  return (
    <div className="space-y-6 p-4">
      <TeamHeader teamId={teamId} pageTitle={t('team_tabs.chargers')} />

      <div className="">
        <TeamTabMenu active="chargers" locale={locale} teamId={teamId} />
      </div>

      <div className="flex-1">
        <div className="rounded-lg bg-card">
          <div className="p-2 md:p-4">
            <div className="px-1">
              <div className="flex items-center justify-between border-b">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setActiveTab('chargers')}
                      className={`pb-2 text-2xl font-medium tracking-[-0.84px] ${
                        activeTab === 'chargers'
                          ? 'text-oc-title-secondary border-b-2 border-primary py-1 font-medium'
                          : 'py-1 text-[#A1B1D1]'
                      }`}
                    >
                      {t('chargers.chargers_name')}
                    </button>
                    <div className="h-8 w-px bg-border" />
                    <button
                      onClick={() => setActiveTab('connectors')}
                      className={`pb-2 text-2xl font-medium tracking-[-0.84px] ${
                        activeTab === 'connectors'
                          ? 'text-oc-title-secondary border-b-2 border-primary py-1 font-medium'
                          : 'py-1 text-[#A1B1D1]'
                      }`}
                    >
                      {t('connectors.connectors_name')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative max-w-[240px]">
                  <Input
                    placeholder={`${t('common.search')}${
                      activeTab === 'connectors'
                        ? t('connectors.connectors_name')
                        : t('chargers.chargers_name')
                    }`}
                    className="h-10 w-full border bg-[#ECF2F8] pl-3 pr-9 text-xs placeholder:text-xs placeholder:font-medium placeholder:text-[#A1B1D1] sm:pl-4 sm:pr-10 sm:text-sm sm:placeholder:text-sm"
                    value={searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#A1B1D1]">
                    <Search className="h-4 w-4" />
                  </span>
                </div>

                <Select value={statusFilter || 'all'} onValueChange={onStatusFilterChange}>
                  <SelectTrigger className="rounded-md border bg-[#ECF2F8] font-medium text-[#A1B1D1] sm:text-sm">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('status.all')}</SelectItem>
                    <SelectItem value="Available">{t('status.available')}</SelectItem>
                    <SelectItem value="Charging">{t('status.charging')}</SelectItem>
                    <SelectItem value="Integrate">{t('status.integrate')}</SelectItem>
                    <SelectItem value="Offline">{t('status.offline')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                {activeTab === 'connectors' && (
                  <>
                    <Button
                      variant="darkwhite"
                      className="h-10 rounded-lg px-6 text-sm"
                      onClick={() => onPriceDialogOpenChange(true)}
                    >
                      {t('buttons.set-price')}
                    </Button>
                    <Button
                      variant="default"
                      className="h-10 px-6 text-xs sm:h-10 sm:text-sm"
                      onClick={() => addConnector.onOpenChange(true)}
                    >
                      <Plus className="size-4" />
                      {t('buttons.add')}
                    </Button>
                    <AddConnectorDialog
                      open={addConnector.open}
                      onOpenChange={addConnector.onOpenChange}
                      teamId={teamId}
                    />
                  </>
                )}
                {activeTab !== 'connectors' && (
                  <Button
                    variant="default"
                    className="h-10 sm:h-10 sm:text-sm"
                    onClick={() => addCharger.onOpenChange(true)}
                  >
                    <Plus className="h-3 w-3" />
                    {t('buttons.add')}
                  </Button>
                )}
              </div>
            </div>
            <Separator className="my-4" />
          </div>

          {activeTab === 'chargers' ? (
            <ChargersTable
              chargers={chargers}
              isLoading={isLoading}
              debouncedSearchTerm={debouncedSearchTerm}
              statusFilter={statusFilter}
              clearAllFilters={clearAll}
              onEditCharger={onEditCharger}
              onSetIntegration={onSetIntegration}
              onDeleteCharger={onDeleteCharger}
            />
          ) : (
            <ConnectorsTable
              connectors={connectors}
              isConnectorsLoading={isConnectorsLoading}
              connectorsError={connectorsError}
              debouncedSearchTerm={debouncedSearchTerm}
              statusFilter={statusFilter}
              clearAllFilters={clearAll}
              setSelectedConnectorForPricing={setSelectedConnector}
              setsetPriceDialogFromTableOpen={onPriceDialogFromTableChange}
              handleEditConnector={onEditConnector}
              handleDeleteConnector={onDeleteConnector}
            />
          )}

          <div className="my-4 border-gray-200 bg-card px-4 py-4 md:px-6">
            {(debouncedSearchTerm || statusFilter) && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-600">Active filters:</span>
                {debouncedSearchTerm && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    Search: &ldquo;{debouncedSearchTerm}&rdquo;
                    <button
                      onClick={clearSearch}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {statusFilter && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                    Status: {statusFilter}
                    <button
                      onClick={clearStatus}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-500 underline hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
              <div className="flex flex-col items-center space-y-2 text-center sm:flex-row sm:space-x-4 sm:space-y-0 sm:text-left">
                <div className="text-xs text-muted-foreground sm:text-sm">
                  Showing {paginationData.showingFrom} to {paginationData.showingTo} of{' '}
                  {paginationData.totalItemsForTab} Results
                  {(debouncedSearchTerm || statusFilter) && (
                    <span className="text-gray-500"> (filtered)</span>
                  )}
                </div>
                <div className="flex items-center">
                  <select
                    className="h-7 rounded-md border bg-input px-1.5 py-0.5 text-xs sm:h-8 md:h-9 md:px-3 md:py-1 md:text-sm"
                    value={pageSizeNum}
                    onChange={(event) => onPageSizeChange(Number(event.target.value))}
                  >
                    <option value="1">1 List</option>
                    <option value="2">2 List</option>
                    <option value="5">5 List</option>
                    <option value="10">10 List</option>
                    <option value="20">20 List</option>
                    <option value="50">50 List</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9"
                  disabled={currentPageNum === 1 || isLoading || isConnectorsLoading}
                  onClick={() => onPageChange(currentPageNum - 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 sm:h-4 sm:w-4"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>

                {(() => {
                  const current = currentPageNum
                  const total = paginationData.totalPagesForTab
                  const pages = [] as JSX.Element[]

                  if (
                    total <= 0 ||
                    (activeTab === 'chargers' && isLoading) ||
                    (activeTab === 'connectors' && isConnectorsLoading)
                  ) {
                    return null
                  }

                  if (total > 0) {
                    pages.push(
                      <Button
                        key={1}
                        variant={current === 1 ? 'default' : 'ghost'}
                        size="icon"
                        className={`h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 ${
                          current === 1
                            ? 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => onPageChange(1)}
                      >
                        <span className="text-xs font-medium sm:text-sm">1</span>
                      </Button>,
                    )
                  }

                  if (current > 4) {
                    pages.push(
                      <span key="start-ellipsis" className="px-2 text-xs text-gray-500 sm:text-sm">
                        ...
                      </span>,
                    )
                  }

                  const start = Math.max(2, current - 1)
                  const end = Math.min(total - 1, current + 1)

                  for (let pageIndex = start; pageIndex <= end; pageIndex++) {
                    if (pageIndex > 1 && pageIndex < total) {
                      pages.push(
                        <Button
                          key={pageIndex}
                          variant={current === pageIndex ? 'default' : 'ghost'}
                          size="icon"
                          className={`h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 ${
                            current === pageIndex
                              ? 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary'
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => onPageChange(pageIndex)}
                        >
                          <span className="text-xs font-medium sm:text-sm">{pageIndex}</span>
                        </Button>,
                      )
                    }
                  }

                  if (current < total - 3) {
                    pages.push(
                      <span key="end-ellipsis" className="px-2 text-xs text-gray-500 sm:text-sm">
                        ...
                      </span>,
                    )
                  }

                  if (total > 1) {
                    pages.push(
                      <Button
                        key={total}
                        variant={current === total ? 'default' : 'ghost'}
                        size="icon"
                        className={`h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 ${
                          current === total
                            ? 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => onPageChange(total)}
                      >
                        <span className="text-xs font-medium sm:text-sm">{total}</span>
                      </Button>,
                    )
                  }

                  return pages
                })()}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9"
                  disabled={
                    currentPageNum === paginationData.totalPagesForTab ||
                    isLoading ||
                    isConnectorsLoading
                  }
                  onClick={() => onPageChange(currentPageNum + 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 sm:h-4 sm:w-4"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddChargerDialog
        open={addCharger.open}
        onOpenChange={addCharger.onOpenChange}
        teamGroupId={teamId}
      />

      <SetPriceDialogFormTable
        open={isPriceDialogFromTableOpen}
        onOpenChange={onPriceDialogFromTableChange}
        onConfirm={() => {
          // Add your price setting logic here
        }}
        initialSelectedConnectors={
          selectedConnector
            ? [selectedConnector as unknown as ConnectorSelectItem]
            : []
        }
      />

      <SetPriceDialog
        open={isPriceDialogOpen}
        onOpenChange={onPriceDialogOpenChange}
        onConfirm={() => {
          // Add your price setting logic here
        }}
      />

      <OcppUrlDialog
        open={ocppDialogOpen}
        onOpenChange={setOcppDialogOpen}
        ocppUrl={ocppUrl}
        setOcppUrl={setOcppUrl}
        ocppUrlInputRef={ocppUrlInputRef}
      />
      <EditChargerDialog
        open={editCharger.open}
        onOpenChange={editCharger.onOpenChange}
        teamGroupId={teamId}
        initialValues={editCharger.initialValues ?? undefined}
        initialStep={editCharger.initialStep}
      />
      <EditConnectorDialog
        open={editConnector.open}
        onOpenChange={editConnector.onOpenChange}
        teamId={teamId}
        connectorData={editConnector.data ?? undefined}
      />
      <DeleteConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={deleteConfirm.onOpenChange}
        description={
          deleteTarget === 'charger'
            ? 'Are you sure you want to delete this charger?'
            : 'Are you sure you want to delete this connector?'
        }
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
