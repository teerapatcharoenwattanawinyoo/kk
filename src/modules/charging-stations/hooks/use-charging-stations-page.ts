'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getPartnerIdFromStorage } from '@/lib/utils/user-storage'
import { getChargingStationDetail } from '@/modules/charging-stations/api'
import { formatStationDateTime, convertStationDetailToFormData } from '@/modules/charging-stations/services'
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
  const searchParams = useSearchParams()

  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get('page')
    return pageParam ? Number.parseInt(pageParam, 10) : 1
  })
  const [pageSize, setPageSize] = useState(() => {
    const pageSizeParam = searchParams.get('pageSize')
    return pageSizeParam ? Number.parseInt(pageSizeParam, 10) : 10
  })
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '')

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState<ChargingStationFormWithGallery | null>(null)
  const [selectedStationId, setSelectedStationId] = useState<string | number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [stationToDelete, setStationToDelete] = useState<ChargingStation | null>(null)
  const [showEditSuccessDialog, setShowEditSuccessDialog] = useState(false)

  const teamGroupId = Number.parseInt(teamId, 10)

  const createStationMutation = useCreateChargingStation()
  const deleteMutation = useDeleteChargingStation()
  const updateStationMutation = useUpdateChargingStation()

  const updateURL = useCallback(
    (page: number, size: number, search: string) => {
      if (typeof window === 'undefined') {
        return
      }

      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('pageSize', size.toString())
      if (search.trim()) {
        params.set('search', search)
      }

      const currentPath = window.location.pathname
      const newUrl = `${currentPath}?${params.toString()}`

      window.history.replaceState({}, '', newUrl)
      router.replace(newUrl, { scroll: false })
    },
    [router],
  )

  useEffect(() => {
    updateURL(currentPage, pageSize, searchQuery)
  }, [currentPage, pageSize, searchQuery, updateURL])

  const queryParams = useMemo<ChargingStationsParams>(
    () => ({
      team_group_id: teamGroupId,
      page: currentPage,
      pageSize,
      search: searchQuery || undefined,
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
      const partnerId = getPartnerIdFromStorage()

      if (!partnerId) {
        const error = new Error('Partner ID not found. Please log in again.')
        toast.error(error.message)
        throw error
      }

      try {
        await createStationMutation.mutateAsync(data)
        setIsCreateDialogOpen(false)
      } catch (error) {
        toast.error('Error creating charging station. Please try again.')
        throw error
      }
    },
    [createStationMutation],
  )

  const handleEditStation = useCallback(
    async (station: ChargingStation) => {
      try {
        const response = await getChargingStationDetail(station.id)
        const apiData = Array.isArray(response.data) ? response.data[0] : response.data

        const convertedData = convertStationDetailToFormData(apiData)

        setSelectedStation(convertedData)
        setSelectedStationId(apiData.id)
        setIsEditDialogOpen(true)
      } catch (error) {
        toast.error('Error loading charging station detail. Please try again.')
      }
    },
    [],
  )

  const handleUpdateStation = useCallback(
    async (data: ChargingStationFormSubmission) => {
      if (!selectedStationId) {
        throw new Error('No charging station selected for update')
      }

      return new Promise<void>((resolve, reject) => {
        const partnerId = getPartnerIdFromStorage()

        if (!partnerId) {
          const error = new Error('Partner ID not found. Please log in again.')
          toast.error(error.message)
          reject(error)
          return
        }

        const work = data.work ?? []

        updateStationMutation.mutate(
          {
            stationId: selectedStationId,
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
              contact: data.contact,
              work,
              image: data.images,
              deletedImageIds: data.deletedImageIds,
            },
          },
          {
            onSuccess: () => {
              setSelectedStation(null)
              setSelectedStationId(null)
              setIsEditDialogOpen(false)
              toast.success('Charging station updated successfully')
              resolve()
            },
            onError: (error) => {
              toast.error('Error updating charging station. Please try again.')
              reject(error)
            },
          },
        )
      })
    },
    [selectedStationId, teamGroupId, updateStationMutation],
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
      await deleteMutation.mutateAsync(stationToDelete.id)
      setDeleteDialogOpen(false)
      setStationToDelete(null)
      toast.success('Charging station deleted successfully')
    } catch (error) {
      toast.error('Error deleting charging station. Please try again.')
    }
  }, [deleteMutation, stationToDelete])

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize)
      setCurrentPage(1)
      updateURL(1, newPageSize, searchQuery)
    },
    [searchQuery, updateURL],
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage)
      updateURL(newPage, pageSize, searchQuery)
    },
    [pageSize, searchQuery, updateURL],
  )

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      setSearchQuery(newSearch)
      setCurrentPage(1)
      updateURL(1, pageSize, newSearch)
    },
    [pageSize, updateURL],
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
    isDeleting: deleteMutation.status === 'pending',
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
