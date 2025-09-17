'use client'
import { TeamHeader } from '@/components/back-office/team/team-header'
import { Button } from '@/components/ui/button'
import { convertStationDetailToFormData } from '@/modules/charging-stations/api/charging-station'
import { ChargingStationsTable } from '@/modules/charging-stations/components'
import {
  type ChargingStationFormData,
  type CreateChargingStationRequest,
  type ExtendedUpdateChargingStationRequest,
  type WorkTime,
} from '@/modules/charging-stations/schemas/charging-stations.schema'
import { AddChargingStationDialog } from '@modules/charging-stations/components'

// ============================
// Types & Interfaces
// ============================

interface ChargingStationFormWithWork extends ChargingStationFormData {
  work?: WorkTime[]
  images?: File[] // รูปใหม่ที่จะอัพโหลด
  deletedImageIds?: number[] // ID ของรูปที่จะลบ
}

import { DeleteConfirmDialog, SuccessDialog } from '@/components/notifications'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { TeamTabMenu } from '@/components/back-office/team/settings/TeamTabMenu'
import { useI18n } from '@/lib/i18n'
import { getPartnerIdFromStorage } from '@/lib/utils/user-storage'
import { getChargingStationDetail } from '@/modules/charging-stations/api/charging-station'
import { ChargingStation } from '@/modules/charging-stations/hooks/use-charging-stations'
import { EditsChargingStationDialog } from '@modules/charging-stations/components'
import {
  useChargingStations,
  useCreateChargingStation,
  useDeleteChargingStation,
  useUpdateChargingStation,
} from '@modules/charging-stations/hooks'
import { ChevronDown, Plus, Search } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ChargingStationsPageProps {
  teamId: string
}

export function ChargingStationsPage({ teamId }: ChargingStationsPageProps) {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()

  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get('page')
    return pageParam ? parseInt(pageParam, 10) : 1
  })

  const [pageSize, setPageSize] = useState(() => {
    const pageSizeParam = searchParams.get('pageSize')
    return pageSizeParam ? parseInt(pageSizeParam, 10) : 10
  })

  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get('search') || ''
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState<ChargingStationFormData | null>(null)
  const [selectedStationId, setSelectedStationId] = useState<string | number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [stationToDelete, setStationToDelete] = useState<ChargingStation | null>(null)
  const [showEditSuccessDialog, setShowEditSuccessDialog] = useState(false)

  const teamGroupId = parseInt(teamId, 10)

  const createStationMutation = useCreateChargingStation()
  const deleteMutation = useDeleteChargingStation()
  const updateStation = useUpdateChargingStation()

  const updateURL = useCallback(
    (page: number, size: number, search: string) => {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('pageSize', size.toString())
      if (search.trim()) {
        params.set('search', search)
      }

      const currentPath = window.location.pathname
      const newUrl = `${currentPath}?${params.toString()}`
      console.log('Updating URL to:', newUrl)

      window.history.replaceState({}, '', newUrl)

      router.replace(newUrl, { scroll: false })
    },
    [router],
  )

  useEffect(() => {
    console.log('Initializing URL with:', {
      currentPage,
      pageSize,
      searchQuery,
    })
    updateURL(currentPage, pageSize, searchQuery)
  }, [currentPage, pageSize, searchQuery, updateURL])

  // Fetch charging stations data
  const apiParams = {
    team_group_id: teamGroupId,
    page: currentPage,
    pageSize: pageSize,
    search: searchQuery || undefined,
  }

  const { data: stationsResponse, isLoading, error } = useChargingStations(apiParams)

  const chargingStations = stationsResponse?.data?.data || []
  const totalItems = stationsResponse?.data?.item_total || 0
  const totalPages = stationsResponse?.data?.page_total || 1

  const handleAddStation = async (data: CreateChargingStationRequest) => {
    console.log('New charging station data:', data)
    const partnerId = getPartnerIdFromStorage()

    if (!partnerId) {
      console.error('Partner ID not found in localStorage')
      const error = new Error('Partner ID not found. Please log in again.')
      throw error
    }

    try {
      await createStationMutation.mutateAsync(data)
      // Close the dialog
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error creating charging station:', error)
      // ไม่ใช้ toast.error ที่นี่แล้ว ให้ dialog จัดการเอง
      // Re-throw error เพื่อให้ dialog สามารถจับได้
      throw error
    }
  }

  const handleShowEditSuccessDialog = () => {
    console.log('handleShowEditSuccessDialog called')
    setShowEditSuccessDialog(true)
  }

  const handleEditSuccessDialogClose = () => {
    console.log('handleEditSuccessDialogClose called')
    setShowEditSuccessDialog(false)
    setSelectedStation(null)
    setSelectedStationId(null)
    setIsEditDialogOpen(false)
  }

  const handleEditStation = async (station: ChargingStation) => {
    const res = await getChargingStationDetail(station.id)
    const apiData = Array.isArray(res.data) ? res.data[0] : res.data

    // Use the proper conversion function instead of manual mapping
    const convertedData = convertStationDetailToFormData(apiData)

    // Extract the form data part (excluding existingGallery)
    const { existingGallery, ...formData } = convertedData

    // Store the form data and pass existingGallery to the dialog separately
    setSelectedStation({
      ...formData,
      // Add existingGallery as a separate property for the dialog to use
      existingGallery,
    } as ChargingStationFormData & { existingGallery: any[] })
    setSelectedStationId(apiData.id)
    setIsEditDialogOpen(true)
  }

  const handleUpdateStation = async (data: ChargingStationFormWithWork) => {
    console.log('handleUpdateStation called with data:', data)
    console.log('🔥 data.images in handleUpdateStation:', data.images)
    console.log('🔥 data.images type:', typeof data.images)
    console.log('🔥 data.images length:', data.images?.length)
    return new Promise<void>((resolve, reject) => {
      try {
        const partnerId = getPartnerIdFromStorage()
        console.log('Partner ID:', partnerId)

        // ใช้ work array ที่ส่งมาจาก dialog
        const work: WorkTime[] = data.work ?? []

        console.log('Prepared work array:', work)

        updateStation.mutate(
          {
            stationId: selectedStationId!,
            team_group_id: teamGroupId,
            data: {
              station_type_id: data.station_type_id,
              latitude: data.coordinates.lat.toString(),
              longtitude: data.coordinates.lng.toString(),
              station_name: data.station_name,
              station_name_th: data.station_name_th,
              station_name_lao: data.station_name_lao,
              station_detail: data.station_detail,
              station_detail_th: data.station_detail_th,
              station_detail_lao: data.station_detail_lao,
              status: data.status,
              show_on_map: data.show_on_map,
              address: data.address,
              contact: data.contact, // เพิ่ม contact field
              work,
              image: data.images, // รูปใหม่ที่จะอัพโหลด
              deletedImageIds: data.deletedImageIds, // ID ของรูปที่จะลบ
            } as ExtendedUpdateChargingStationRequest,
          },
          {
            onSuccess: () => {
              console.log('updateStation.mutate onSuccess called')
              setSelectedStation(null)
              setSelectedStationId(null)
              setIsEditDialogOpen(false)
              console.log('About to resolve Promise')
              resolve()
              toast.success('Charging station updated successfully')
            },
            onError: (error) => {
              console.error('updateStation.mutate onError called with:', error)
              toast.error('Error updating charging station. Please try again.')
              reject(error)
            },
          },
        )
      } catch (error) {
        console.error('Error in handleUpdateStation try-catch:', error)
        toast.error('Error updating charging station. Please try again.')
        reject(error)
      }
    })
  }

  const handleDeleteClick = (station: ChargingStation) => {
    try {
      setStationToDelete(station)
      setDeleteDialogOpen(true)
    } catch (error) {
      console.error('Error opening delete dialog:', error)
      toast.error('Error opening delete dialog. Please try again.')
    }
  }

  const handleConfirmDelete = async () => {
    if (!stationToDelete) return
    try {
      await deleteMutation.mutateAsync(stationToDelete.id)

      setDeleteDialogOpen(false)
      setStationToDelete(null)
      toast.success('Charging station deleted successfully')
    } catch (err) {
      console.log('🚀 ~ handleConfirmDelete ~ err:', err)
      toast.error('Error deleting charging station. Please try again.')
    }
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)

    updateURL(1, newPageSize, searchQuery)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    updateURL(newPage, pageSize, searchQuery)
  }

  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch)
    setCurrentPage(1)

    updateURL(1, pageSize, newSearch)
  }

  const formatDateTime = (date: string, time: string) => {
    return `${date}\n${time}`
  }

  useEffect(() => {}, [currentPage, pageSize, teamGroupId, searchQuery])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Header Section */}
      <TeamHeader teamId={teamId} pageTitle={t('team_tabs.charging_stations')} />

      {/* Navigation Tabs Section */}
      <div className="px-4 md:px-6">
        <TeamTabMenu active="charging-stations" locale={String(params.locale)} teamId={teamId} />
      </div>

      {/* Main Content Section */}
      <div className="flex-1 px-4 py-4 md:px-6">
        <div className="shadow-xs rounded-lg bg-card">
          {/* Search and Filter Section */}
          <div className="p-4 md:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div className="flex flex-1 gap-3">
                <div className="relative max-w-xs">
                  <Input
                    placeholder={t('charging-stations.search_by_station')}
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="h-10 w-48 border-0 border-slate-200 bg-[#ECF2F8] pl-4 pr-10 placeholder:font-medium placeholder:text-[#A1B1D1]"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#A1B1D1]">
                    <Search className="h-4 w-4" />
                  </span>
                </div>
                <Button
                  variant={'outline'}
                  size="sm"
                  className="h-10 gap-1 whitespace-nowrap border-0 bg-[#ECF2F8] text-xs sm:text-sm"
                >
                  <span className="text-[#A1B1D1]">{t('charging-stations.filter_by_status')}</span>
                  <ChevronDown className="h-4 w-4 text-[#A1B1D1]" />
                </Button>
              </div>
              <Button className="h-10 sm:text-sm" onClick={() => setIsDialogOpen(true)}>
                <Plus className="size-4" />
                {t('buttons.add')}
              </Button>
            </div>
            <Separator className="my-4" />
          </div>

          {/* Table Section */}
          <ChargingStationsTable
            chargingStations={chargingStations}
            isLoading={isLoading}
            error={error}
            pageSize={pageSize}
            onEditStation={handleEditStation}
            onDeleteClick={handleDeleteClick}
            formatDateTime={formatDateTime}
          />

          {/* Pagination Section */}
          <div className="my-4 bg-card px-4 py-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="text-sm font-light text-foreground">
                  {t('pagination.showing')} {(currentPage - 1) * pageSize + 1} {t('pagination.to')}{' '}
                  {Math.min(currentPage * pageSize, totalItems)} {t('pagination.of')} {totalItems}{' '}
                  {t('pagination.result')}
                </div>
                <div className="flex items-center">
                  <select
                    className="h-8 rounded-md border bg-card px-4 py-1 text-sm md:h-9 md:px-3"
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  >
                    <option value="1">1 {t('pagination.list')}</option>
                    <option value="10">10 {t('pagination.list')}</option>
                    <option value="20">20 {t('pagination.list')}</option>
                    <option value="50">50 {t('pagination.list')}</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <Button
                  variant={'ghost'}
                  size="icon"
                  className="h-8 w-8 md:h-9 md:w-9"
                  disabled={currentPage === 1}
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

                {/* Page Numbers */}
                {(() => {
                  const pageNumbers = []
                  const maxVisiblePages = 5
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
                  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

                  // Adjust startPage if we're near the end
                  if (endPage - startPage < maxVisiblePages - 1) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1)
                  }

                  // Always show first page
                  if (startPage > 1) {
                    pageNumbers.push(
                      <Button
                        key={1}
                        variant={currentPage === 1 ? 'default' : 'ghost'}
                        size="icon"
                        className={`h-8 w-8 font-light md:h-9 md:w-9 ${
                          currentPage === 1
                            ? 'bg-primary/20 text-primary hover:text-white'
                            : 'text-[#606266] hover:bg-gray-100'
                        }`}
                        onClick={() => handlePageChange(1)}
                      >
                        1
                      </Button>,
                    )

                    if (startPage > 2) {
                      pageNumbers.push(
                        <span key="ellipsis-start" className="px-2 font-light text-[#606266]">
                          ...
                        </span>,
                      )
                    }
                  }

                  // Show page numbers in range
                  for (let i = startPage; i <= endPage; i++) {
                    if (i === 1 && startPage === 1) {
                      // Skip if we already added page 1
                      pageNumbers.push(
                        <Button
                          key={i}
                          variant={currentPage === i ? 'default' : 'ghost'}
                          size="icon"
                          className={`h-8 w-8 rounded-xl font-normal md:h-9 md:w-9 ${
                            currentPage === i
                              ? 'bg-primary/20 text-primary hover:text-white'
                              : 'text-[#606266] hover:bg-gray-100'
                          }`}
                          onClick={() => handlePageChange(i)}
                        >
                          {i}
                        </Button>,
                      )
                    } else if (i !== 1) {
                      pageNumbers.push(
                        <Button
                          key={i}
                          variant={currentPage === i ? 'default' : 'ghost'}
                          size="icon"
                          className={`h-8 w-8 font-normal md:h-9 md:w-9 ${
                            currentPage === i
                              ? 'bg-primary/20 text-primary hover:text-white'
                              : 'text-[#606266] hover:bg-gray-100'
                          }`}
                          onClick={() => handlePageChange(i)}
                        >
                          {i}
                        </Button>,
                      )
                    }
                  }

                  // Always show last page
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pageNumbers.push(
                        <span key="ellipsis-end" className="px-2 font-normal text-[#606266]">
                          ...
                        </span>,
                      )
                    }

                    pageNumbers.push(
                      <Button
                        key={totalPages}
                        variant={currentPage === totalPages ? 'default' : 'ghost'}
                        size="icon"
                        className={`h-8 w-8 font-normal md:h-9 md:w-9 ${
                          currentPage === totalPages
                            ? 'bg-primary text-white'
                            : 'text-[#606266] hover:bg-gray-100'
                        }`}
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </Button>,
                    )
                  }

                  return pageNumbers
                })()}

                {/* Next Button */}
                <Button
                  variant={'ghost'}
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

      {/* Dialog Section */}
      {/* Add Charging Station Dialog */}
      <AddChargingStationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddStation}
        teamGroupId={teamGroupId}
      />

      {/* Edit Charging Station Dialog */}
      {selectedStation && (
        <EditsChargingStationDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdateStation}
          initialData={selectedStation} // fallback ถ้า API ล้มเหลว
          onShowSuccess={handleShowEditSuccessDialog}
        />
      )}

      {/* Edit Success Dialog */}
      <SuccessDialog
        open={showEditSuccessDialog}
        onOpenChange={setShowEditSuccessDialog}
        title="Success"
        message="Charging Station has been updated successfully"
        buttonText="Done"
        onButtonClick={handleEditSuccessDialogClose}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        itemName={stationToDelete?.station_name}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.status === 'pending'}
      />
    </div>
  )
}
