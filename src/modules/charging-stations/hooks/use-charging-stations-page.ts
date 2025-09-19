'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  buildChargingStationsQueryParams,
  createStationRecord,
  deleteStationRecord,
  fetchStationFormData,
  formatStationDateTime,
  PartnerIdNotFoundError,
  parsePaginationState,
  syncPaginationWithRouter,
  updateStationRecord,
} from '@/modules/charging-stations/services'
import {
  type ChargingStation,
  type ChargingStationFormSubmission,
  type ChargingStationFormWithGallery,
  type ChargingStationsParams,
  type CreateChargingStationRequest,
} from '@/modules/charging-stations/schemas/charging-stations.schema'

import {
  useChargingStations,
  useCreateChargingStation,
  useDeleteChargingStation,
  useUpdateChargingStation,
} from './use-charging-stations'

interface UseChargingStationsPageControllerOptions {
  teamId: string
}

interface UseChargingStationsPageControllerReturn {
  chargingStations: ChargingStation[]
  totalItems: number
  totalPages: number
  isLoading: boolean
  error: Error | null
  currentPage: number
  pageSize: number
  searchQuery: string
  teamGroupId: number
  isCreateDialogOpen: boolean
  isEditDialogOpen: boolean
  deleteDialogOpen: boolean
  showEditSuccessDialog: boolean
  selectedStation: ChargingStationFormWithGallery | null
  stationToDelete: ChargingStation | null
  isDeleting: boolean
  formatDateTime: (date: string, time: string) => string
  openCreateDialog: () => void
  closeCreateDialog: () => void
  handleCreateDialogChange: (open: boolean) => void
  handleEditDialogChange: (open: boolean) => void
  handleDeleteDialogChange: (open: boolean) => void
  handleSuccessDialogChange: (open: boolean) => void
  handleSearchChange: (value: string) => void
  handlePageChange: (page: number) => void
  handlePageSizeChange: (size: number) => void
  handleAddStation: (data: CreateChargingStationRequest) => Promise<void>
  handleEditStation: (station: ChargingStation) => Promise<void>
  handleUpdateStation: (data: ChargingStationFormSubmission) => Promise<void>
  handleShowEditSuccessDialog: () => void
  handleEditSuccessDialogClose: () => void
  handleDeleteClick: (station: ChargingStation) => void
  handleConfirmDelete: () => Promise<void>
}

export function useChargingStationsPageController({
  teamId,
}: UseChargingStationsPageControllerOptions): UseChargingStationsPageControllerReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialPagination = useMemo(() => parsePaginationState(searchParams), [searchParams])

  const [currentPage, setCurrentPage] = useState(initialPagination.page)
  const [pageSize, setPageSize] = useState(initialPagination.pageSize)
  const [searchQuery, setSearchQuery] = useState(initialPagination.searchQuery)

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState<ChargingStationFormWithGallery | null>(null)
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [stationToDelete, setStationToDelete] = useState<ChargingStation | null>(null)
  const [showEditSuccessDialog, setShowEditSuccessDialog] = useState(false)

  const teamGroupId = Number.parseInt(teamId, 10)

  const { mutateAsync: createStationAsync } = useCreateChargingStation()
  const { mutateAsync: deleteStationAsync, status: deleteStatus } = useDeleteChargingStation()
  const { mutateAsync: updateStationAsync } = useUpdateChargingStation()

  const syncPagination = useCallback(
    (page: number, size: number, search: string) => {
      syncPaginationWithRouter(router, pathname, {
        page,
        pageSize: size,
        searchQuery: search,
      })
    },
    [pathname, router],
  )

  useEffect(() => {
    syncPagination(currentPage, pageSize, searchQuery)
  }, [currentPage, pageSize, searchQuery, syncPagination])

  const queryParams = useMemo<ChargingStationsParams>(
    () =>
      buildChargingStationsQueryParams(teamGroupId, {
        page: currentPage,
        pageSize,
        searchQuery,
      }),
    [teamGroupId, currentPage, pageSize, searchQuery],
  )

  const {
    data: stationsResponse,
    isLoading,
    error: stationsError,
  } = useChargingStations(queryParams)

  const chargingStations = stationsResponse?.data?.data ?? []
  const totalItems = stationsResponse?.data?.item_total ?? 0
  const totalPages = stationsResponse?.data?.page_total ?? 1

  const normalizedError = stationsError instanceof Error ? stationsError : null

  const handleAddStation = useCallback(
    async (data: CreateChargingStationRequest) => {
      try {
        await createStationRecord(data, createStationAsync)
        setIsCreateDialogOpen(false)
      } catch (error) {
        if (error instanceof PartnerIdNotFoundError) {
          toast.error(error.message)
        } else {
          toast.error('Error creating charging station. Please try again.')
        }
        throw error
      }
    },
    [createStationAsync],
  )

  const handleEditStation = useCallback(async (station: ChargingStation) => {
    try {
      const { id, formData } = await fetchStationFormData(station.id)
      setSelectedStation(formData)
      setSelectedStationId(id)
      setIsEditDialogOpen(true)
    } catch (error) {
      console.error('Failed to load charging station detail', error)
      toast.error('Error loading charging station detail. Please try again.')
    }
  }, [])

  const handleUpdateStation = useCallback(
    async (data: ChargingStationFormSubmission) => {
      if (!selectedStationId) {
        throw new Error('No charging station selected for update')
      }

      try {
        await updateStationRecord(selectedStationId, teamGroupId, data, updateStationAsync)
        setSelectedStation(null)
        setSelectedStationId(null)
        setIsEditDialogOpen(false)
        toast.success('Charging station updated successfully')
      } catch (error) {
        if (error instanceof PartnerIdNotFoundError) {
          toast.error(error.message)
        } else {
          toast.error('Error updating charging station. Please try again.')
        }
        throw error
      }
    },
    [selectedStationId, teamGroupId, updateStationAsync],
  )

  const handleShowEditSuccessDialog = useCallback(() => {
    setShowEditSuccessDialog(true)
  }, [])

  const handleEditSuccessDialogClose = useCallback(() => {
    setShowEditSuccessDialog(false)
    setSelectedStation(null)
    setSelectedStationId(null)
    setIsEditDialogOpen(false)
  }, [])

  const handleDeleteClick = useCallback((station: ChargingStation) => {
    setStationToDelete(station)
    setDeleteDialogOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!stationToDelete) return

    try {
      await deleteStationRecord(stationToDelete.id, deleteStationAsync)
      setDeleteDialogOpen(false)
      setStationToDelete(null)
      toast.success('Charging station deleted successfully')
    } catch (error) {
      console.error('Failed to delete charging station', error)
      toast.error('Error deleting charging station. Please try again.')
    }
  }, [deleteStationAsync, stationToDelete])

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize)
      setCurrentPage(1)
      syncPagination(1, newPageSize, searchQuery)
    },
    [searchQuery, syncPagination],
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage)
      syncPagination(newPage, pageSize, searchQuery)
    },
    [pageSize, searchQuery, syncPagination],
  )

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      setSearchQuery(newSearch)
      setCurrentPage(1)
      syncPagination(1, pageSize, newSearch)
    },
    [pageSize, syncPagination],
  )

  const openCreateDialog = useCallback(() => setIsCreateDialogOpen(true), [])
  const closeCreateDialog = useCallback(() => setIsCreateDialogOpen(false), [])

  const handleCreateDialogChange = useCallback((open: boolean) => {
    setIsCreateDialogOpen(open)
  }, [])

  const handleEditDialogChange = useCallback(
    (open: boolean) => {
      setIsEditDialogOpen(open)
      if (!open) {
        setSelectedStation(null)
        setSelectedStationId(null)
      }
    },
    [],
  )

  const handleDeleteDialogChange = useCallback((open: boolean) => {
    setDeleteDialogOpen(open)
    if (!open) {
      setStationToDelete(null)
    }
  }, [])

  const handleSuccessDialogChange = useCallback((open: boolean) => {
    setShowEditSuccessDialog(open)
  }, [])

  return {
    chargingStations,
    totalItems,
    totalPages,
    isLoading,
    error: normalizedError,
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
    isDeleting: deleteStatus === 'pending',
    formatDateTime: formatStationDateTime,
    openCreateDialog,
    closeCreateDialog,
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
  }
}
