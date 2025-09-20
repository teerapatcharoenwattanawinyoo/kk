'use client'

import {
  AddChargingStationDialog,
  ChargingStationsTable,
  EditsChargingStationDialog,
  type ChargingStation,
} from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations'
import { useChargingStationsPage } from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations/_hooks'
import { type CreateChargingStationRequest } from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations/_schemas'
import { type ChargingStationFormWithWork } from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations/_services'
import { TeamHeader } from '@/app/[locale]/(back-office)/team/_components/team-header'
import { TeamTabMenu } from '@/app/[locale]/(back-office)/team/_components/team-tab-menu'
import { DeleteConfirmDialog, SuccessDialog } from '@/components/notifications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useI18n } from '@/lib/i18n'
import { ChevronDown, Plus, Search } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

interface ChargingStationsPageProps {
  teamId: string
}

export function ChargingStationsPage({ teamId }: ChargingStationsPageProps) {
  const { t } = useI18n()
  const params = useParams()
  const teamGroupId = Number.parseInt(teamId, 10)

  const { pagination, search, dialogs, selection, data, status, actions } = useChargingStationsPage(
    { teamId },
  )

  const tableError = data.error instanceof Error ? data.error : null

  const handleAddStation = async (payload: CreateChargingStationRequest) => {
    try {
      await actions.addStation(payload)
    } catch (error) {
      throw error
    }
  }

  const handleEditStation = async (station: ChargingStation) => {
    try {
      await actions.editStation(station)
    } catch (error) {
      toast.error('Failed to load charging station details. Please try again.')
    }
  }

  const handleUpdateStation = async (payload: ChargingStationFormWithWork) => {
    try {
      await actions.updateStation(payload)
    } catch (error) {
      throw error
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await actions.confirmDelete()
      toast.success('Charging station deleted successfully')
    } catch (error) {
      toast.error('Error deleting charging station. Please try again.')
    }
  }

  const handleShowEditSuccessDialog = () => {
    dialogs.editSuccess.open()
  }

  const handleEditSuccessDialogClose = () => {
    actions.resetEditState()
  }

  return (
    <div className="space-y-6 px-3 py-4 md:px-6 lg:px-8">
      <TeamHeader teamId={teamId} pageTitle={t('team_tabs.charging_stations')} />

      <div className="">
        <TeamTabMenu active="charging-stations" locale={String(params.locale)} teamId={teamId} />
      </div>

      <div className="flex-1">
        <div className="shadow-xs rounded-lg bg-card">
          <div className="p-3 md:p-5 lg:p-6">
            <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[1fr_auto]">
              <div className="flex flex-1 flex-wrap items-center gap-2 sm:gap-3">
                <div className="relative w-full min-w-0 sm:w-auto sm:min-w-[16rem] md:min-w-[20rem] lg:min-w-[24rem]">
                  <Input
                    placeholder={t('charging-stations.search_by_station')}
                    value={search.query}
                    onChange={(event) => search.onChange(event.target.value)}
                    className="h-9 w-full border-0 border-slate-200 bg-[#ECF2F8] pl-4 pr-10 placeholder:font-medium placeholder:text-[#A1B1D1] sm:h-10"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#A1B1D1]">
                    <Search className="h-4 w-4" />
                  </span>
                </div>
                <Button
                  variant={'outline'}
                  size="sm"
                  className="h-9 gap-1 whitespace-nowrap border-0 bg-[#ECF2F8] text-xs sm:h-10 sm:text-sm"
                >
                  <span className="text-[#A1B1D1]">{t('charging-stations.filter_by_status')}</span>
                  <ChevronDown className="h-4 w-4 text-[#A1B1D1]" />
                </Button>
              </div>
              <Button className="h-10 w-full sm:w-auto sm:text-sm" onClick={dialogs.add.open}>
                <Plus className="size-4" />
                {t('buttons.add')}
              </Button>
            </div>
            <Separator className="my-4" />
          </div>

          <ChargingStationsTable
            chargingStations={data.chargingStations}
            isLoading={data.isLoading}
            error={tableError}
            pageSize={pagination.pageSize}
            onEditStation={handleEditStation}
            onDeleteClick={dialogs.delete.open}
            formatDateTime={actions.formatDateTime}
          />

          <div className="my-4 bg-transparent px-3 py-3 md:px-5 md:py-4 lg:px-6">
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
                <div className="text-sm font-light text-foreground">
                  {t('pagination.showing')} {(pagination.currentPage - 1) * pagination.pageSize + 1}{' '}
                  {t('pagination.to')}{' '}
                  {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}{' '}
                  {t('pagination.of')} {pagination.totalItems} {t('pagination.result')}
                </div>
                <div className="flex items-center">
                  <select
                    className="h-9 w-full rounded-md border bg-card px-3 py-1 text-sm sm:h-9 sm:w-auto md:px-3"
                    value={pagination.pageSize}
                    onChange={(event) => pagination.onPageSizeChange(Number(event.target.value))}
                  >
                    <option value="1">1 {t('pagination.list')}</option>
                    <option value="10">10 {t('pagination.list')}</option>
                    <option value="20">20 {t('pagination.list')}</option>
                    <option value="50">50 {t('pagination.list')}</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 sm:justify-end">
                <Button
                  variant={'ghost'}
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  disabled={pagination.currentPage === 1}
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
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
                    className="h-4 w-4"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>

                {(() => {
                  const pageNumbers = [] as JSX.Element[]
                  const maxVisiblePages = 5
                  let startPage = Math.max(
                    1,
                    pagination.currentPage - Math.floor(maxVisiblePages / 2),
                  )
                  const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1)

                  if (endPage - startPage < maxVisiblePages - 1) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1)
                  }

                  if (startPage > 1) {
                    pageNumbers.push(
                      <Button
                        key={1}
                        variant={pagination.currentPage === 1 ? 'default' : 'ghost'}
                        size="icon"
                        className={`h-8 w-8 font-light sm:h-9 sm:w-9 ${
                          pagination.currentPage === 1
                            ? 'bg-primary/20 text-primary hover:text-white'
                            : 'text-[#606266] hover:bg-gray-100'
                        }`}
                        onClick={() => pagination.onPageChange(1)}
                      >
                        1
                      </Button>,
                    )

                    if (startPage > 2) {
                      pageNumbers.push(
                        <span
                          key="ellipsis-start"
                          className="px-1 font-light text-[#606266] sm:px-2"
                        >
                          ...
                        </span>,
                      )
                    }
                  }

                  for (let page = startPage; page <= endPage; page++) {
                    if (page === 1 && startPage === 1) {
                      pageNumbers.push(
                        <Button
                          key={page}
                          variant={pagination.currentPage === page ? 'default' : 'ghost'}
                          size="icon"
                          className={`h-8 w-8 rounded-xl font-normal sm:h-9 sm:w-9 ${
                            pagination.currentPage === page
                              ? 'bg-primary/20 text-primary hover:text-white'
                              : 'text-[#606266] hover:bg-gray-100'
                          }`}
                          onClick={() => pagination.onPageChange(page)}
                        >
                          {page}
                        </Button>,
                      )
                    } else if (page !== 1) {
                      pageNumbers.push(
                        <Button
                          key={page}
                          variant={pagination.currentPage === page ? 'default' : 'ghost'}
                          size="icon"
                          className={`h-8 w-8 font-normal sm:h-9 sm:w-9 ${
                            pagination.currentPage === page
                              ? 'bg-primary/20 text-primary hover:text-white'
                              : 'text-[#606266] hover:bg-gray-100'
                          }`}
                          onClick={() => pagination.onPageChange(page)}
                        >
                          {page}
                        </Button>,
                      )
                    }
                  }

                  if (endPage < pagination.totalPages) {
                    if (endPage < pagination.totalPages - 1) {
                      pageNumbers.push(
                        <span
                          key="ellipsis-end"
                          className="px-1 font-normal text-[#606266] sm:px-2"
                        >
                          ...
                        </span>,
                      )
                    }

                    pageNumbers.push(
                      <Button
                        key={pagination.totalPages}
                        variant={
                          pagination.currentPage === pagination.totalPages ? 'default' : 'ghost'
                        }
                        size="icon"
                        className={`h-8 w-8 font-normal sm:h-9 sm:w-9 ${
                          pagination.currentPage === pagination.totalPages
                            ? 'bg-primary text-white'
                            : 'text-[#606266] hover:bg-gray-100'
                        }`}
                        onClick={() => pagination.onPageChange(pagination.totalPages)}
                      >
                        {pagination.totalPages}
                      </Button>,
                    )
                  }

                  return pageNumbers
                })()}

                <Button
                  variant={'ghost'}
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
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
                    className="h-4 w-4"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddChargingStationDialog
        open={dialogs.add.isOpen}
        onOpenChange={dialogs.add.onOpenChange}
        onSubmit={handleAddStation}
        teamGroupId={teamGroupId}
      />

      {selection.selectedStation && (
        <EditsChargingStationDialog
          open={dialogs.edit.isOpen}
          onOpenChange={dialogs.edit.onOpenChange}
          onSubmit={handleUpdateStation}
          initialData={selection.selectedStation}
          onShowSuccess={handleShowEditSuccessDialog}
        />
      )}

      <SuccessDialog
        open={dialogs.editSuccess.isOpen}
        onOpenChange={dialogs.editSuccess.onOpenChange}
        title="Success"
        message="Charging Station has been updated successfully"
        buttonText="Done"
        onButtonClick={handleEditSuccessDialogClose}
      />

      <DeleteConfirmDialog
        open={dialogs.delete.isOpen}
        onOpenChange={dialogs.delete.onOpenChange}
        itemName={selection.stationToDelete?.station_name}
        onConfirm={handleConfirmDelete}
        isLoading={status.isDeleting}
      />
    </div>
  )
}
