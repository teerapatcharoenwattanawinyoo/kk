'use client'

import { TeamHeader } from '@/components/back-office/team/team-header'
import { TeamTabMenu } from '@/components/back-office/team/settings/TeamTabMenu'
import { DeleteConfirmDialog, SuccessDialog } from '@/components/notifications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useI18n } from '@/lib/i18n'
import { useChargingStationsPageController } from '@/modules/charging-stations/hooks'
import { ChevronDown, Plus, Search } from 'lucide-react'
import type { JSX } from 'react'
import { useParams } from 'next/navigation'
import AddChargingStationDialog from './add-charging-station-dialog'
import { ChargingStationsTable } from './charging-stations-table'
import EditsChargingStationDialog from './edits-charging-station-dialog'

interface ChargingStationsPageProps {
  teamId: string
}

export function ChargingStationsPage({ teamId }: ChargingStationsPageProps) {
  const { t } = useI18n()
  const params = useParams()

  const {
    chargingStations,
    totalItems,
    totalPages,
    isLoading,
    error,
    currentPage,
    pageSize,
    searchQuery,
    teamGroupId,
    isCreateDialogOpen,
    isEditDialogOpen,
    deleteDialogOpen,
    showEditSuccessDialog,
    selectedStation,
    stationToDelete,
    isDeleting,
    formatDateTime,
    openCreateDialog,
    handleCreateDialogChange,
    handleEditDialogChange,
    handleDeleteDialogChange,
    handleSuccessDialogChange,
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleAddStation,
    handleEditStation,
    handleUpdateStation,
    handleShowEditSuccessDialog,
    handleEditSuccessDialogClose,
    handleDeleteClick,
    handleConfirmDelete,
  } = useChargingStationsPageController({ teamId })

  const renderPageNumbers = () => {
    const maxPagesToShow = 3
    const pageNumbers: JSX.Element[] = []

    const addPageButton = (page: number) => {
      pageNumbers.push(
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'ghost'}
          size="icon"
          className={`h-8 w-8 font-normal md:h-9 md:w-9 ${
            currentPage === page ? 'bg-primary text-white' : 'text-[#606266] hover:bg-gray-100'
          }`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Button>,
      )
    }

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i += 1) {
        addPageButton(i)
      }
      return pageNumbers
    }

    addPageButton(1)

    if (currentPage > 2) {
      pageNumbers.push(
        <span key="dots-start" className="text-muted-blue px-2">
          ...
        </span>,
      )
    }

    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    for (let i = startPage; i <= endPage; i += 1) {
      addPageButton(i)
    }

    if (currentPage < totalPages - 1) {
      pageNumbers.push(
        <span key="dots-end" className="text-muted-blue px-2">
          ...
        </span>,
      )
    }

    addPageButton(totalPages)

    return pageNumbers
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <TeamHeader teamId={teamId} pageTitle={t('team_tabs.charging_stations')} />

      <div className="px-4 md:px-6">
        <TeamTabMenu active="charging-stations" locale={String(params.locale)} teamId={teamId} />
      </div>

      <div className="flex-1 px-4 py-4 md:px-6">
        <div className="shadow-xs rounded-lg bg-card">
          <div className="p-4 md:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div className="flex flex-1 gap-3">
                <div className="relative max-w-xs">
                  <Input
                    placeholder={t('charging-stations.search_by_station')}
                    value={searchQuery}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    className="h-10 w-48 border-0 border-slate-200 bg-[#ECF2F8] pl-4 pr-10 placeholder:font-medium placeholder:text-[#A1B1D1]"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#A1B1D1]">
                    <Search className="h-4 w-4" />
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="text-muted-blue flex items-center gap-2 border-[#D5DFEC] px-3 py-2 text-xs font-semibold"
                >
                  <span>{t('charging-stations.status')}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                <Button
                  className="bg-primary flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white"
                  onClick={openCreateDialog}
                >
                  <Plus className="h-4 w-4" />
                  <span>{t('charging-stations.add_charging_station')}</span>
                </Button>
              </div>
            </div>
          </div>

          <Separator className="bg-[#EDF2F9]" />

          <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-muted-blue text-xs font-semibold uppercase">
                {t('charging-stations.total_charging_stations', { count: totalItems })}
              </p>

              <div className="flex items-center gap-3">
                <span className="text-muted-blue text-xs font-semibold uppercase">
                  {t('charging-stations.rows_per_page')}
                </span>
                <div className="relative group">
                  <Button
                    variant="outline"
                    className="text-muted-blue flex items-center gap-2 border-[#D5DFEC] px-3 py-2 text-xs font-semibold"
                  >
                    {pageSize}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <div className="absolute right-0 z-10 mt-1 hidden min-w-[120px] rounded-md border bg-white shadow-md group-hover:block">
                    {[5, 10, 20, 50].map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`text-muted-blue block w-full px-4 py-2 text-left text-xs hover:bg-gray-100 ${
                          pageSize === size ? 'font-semibold' : ''
                        }`}
                        onClick={() => handlePageSizeChange(size)}
                      >
                        {size} {t('charging-stations.rows')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <ChargingStationsTable
              chargingStations={chargingStations}
              isLoading={isLoading}
              error={error}
              pageSize={pageSize}
              onEditStation={handleEditStation}
              onDeleteClick={handleDeleteClick}
              formatDateTime={formatDateTime}
            />

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-muted-blue text-xs font-semibold uppercase">
                {t('charging-stations.showing_results', {
                  from: (currentPage - 1) * pageSize + (chargingStations.length > 0 ? 1 : 0),
                  to: Math.min(currentPage * pageSize, totalItems),
                  total: totalItems,
                })}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:h-9 md:w-9"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
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

                {renderPageNumbers()}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:h-9 md:w-9"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
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
        open={isCreateDialogOpen}
        onOpenChange={handleCreateDialogChange}
        onSubmit={handleAddStation}
        teamGroupId={teamGroupId}
      />

      {selectedStation && (
        <EditsChargingStationDialog
          open={isEditDialogOpen}
          onOpenChange={handleEditDialogChange}
          onSubmit={handleUpdateStation}
          initialData={selectedStation}
          onShowSuccess={handleShowEditSuccessDialog}
        />
      )}

      <SuccessDialog
        open={showEditSuccessDialog}
        onOpenChange={handleSuccessDialogChange}
        title="Success"
        message="Charging Station has been updated successfully"
        buttonText="Done"
        onButtonClick={handleEditSuccessDialogClose}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        itemName={stationToDelete?.station_name}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
