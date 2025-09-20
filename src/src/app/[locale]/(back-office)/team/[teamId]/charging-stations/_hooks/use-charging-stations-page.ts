'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  type ChargingStation,
  type ChargingStationsParams,
  type CreateChargingStationRequest,
} from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations/_schemas'
import {
  useChargingStations,
  useCreateChargingStation,
  useDeleteChargingStation,
  useUpdateChargingStation,
} from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations/_hooks/use-charging-stations'
import {
  type ChargingStationFormWithGallery,
  type ChargingStationFormWithWork,
  buildChargingStationsQueryParams,
  buildUpdatedUrl,
  ensurePartnerId,
  extractChargingStationsData,
  formatStationDateTime,
  getInitialPaginationState,
  loadStationFormData,
  mapUpdatePayload,
} from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations/_services'

interface UseChargingStationsPageProps {
  teamId: string
}

interface UseChargingStationsPageResult {
  pagination: {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
  search: {
    query: string
    onChange: (value: string) => void
  }
  dialogs: {
    add: {
      isOpen: boolean
      open: () => void
      close: () => void
      onOpenChange: (open: boolean) => void
    }
    edit: {
      isOpen: boolean
      close: () => void
      onOpenChange: (open: boolean) => void
    }
    delete: {
      isOpen: boolean
      open: (station: ChargingStation) => void
      close: () => void
      onOpenChange: (open: boolean) => void
    }
    editSuccess: {
      isOpen: boolean
      open: () => void
      close: () => void
      onOpenChange: (open: boolean) => void
    }
  }
  selection: {
    stationToDelete: ChargingStation | null
    selectedStation: ChargingStationFormWithGallery | null
    selectedStationId: string | number | null
  }
  data: {
    chargingStations: ChargingStation[]
    isLoading: boolean
    error: unknown
  }
  status: {
    isDeleting: boolean
  }
  actions: {
    addStation: (data: CreateChargingStationRequest) => Promise<void>
    editStation: (station: ChargingStation) => Promise<void>
    updateStation: (data: ChargingStationFormWithWork) => Promise<void>
    confirmDelete: () => Promise<void>
    formatDateTime: (date: string, time: string) => string
    resetEditState: () => void
  }
}

export function useChargingStationsPage(
  props: UseChargingStationsPageProps,
): UseChargingStationsPageResult {
  const { teamId } = props
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialState = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    return getInitialPaginationState(params)
  }, [searchParams])

  const [currentPage, setCurrentPage] = useState(initialState.currentPage)
  const [pageSize, setPageSize] = useState(initialState.pageSize)
  const [searchQuery, setSearchQuery] = useState(initialState.searchQuery)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditSuccessDialogOpen, setIsEditSuccessDialogOpen] = useState(false)

  const [selectedStation, setSelectedStation] =
    useState<ChargingStationFormWithGallery | null>(null)
  const [selectedStationId, setSelectedStationId] =
    useState<string | number | null>(null)
  const [stationToDelete, setStationToDelete] = useState<ChargingStation | null>(
    null,
  )

  const teamGroupId = useMemo(() => Number.parseInt(teamId, 10), [teamId])

  const createStationMutation = useCreateChargingStation()
  const deleteStationMutation = useDeleteChargingStation()
  const updateStationMutation = useUpdateChargingStation()

  const queryParams: ChargingStationsParams = useMemo(() => {
    return buildChargingStationsQueryParams(teamGroupId, {
      currentPage,
      pageSize,
      searchQuery,
    })
  }, [teamGroupId, currentPage, pageSize, searchQuery])

  const {
    data: stationsResponse,
    isLoading,
    error,
  } = useChargingStations(queryParams)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const pathname = window.location.pathname
    const url = buildUpdatedUrl(pathname, {
      currentPage,
      pageSize,
      searchQuery,
    })

    router.replace(url, { scroll: false })
  }, [currentPage, pageSize, searchQuery, router])

  const { list: chargingStations, totalItems, totalPages } = useMemo(() => {
    return extractChargingStationsData(stationsResponse)
  }, [stationsResponse])

  const addStation = useCallback(
    async (data: CreateChargingStationRequest) => {
      ensurePartnerId()
      await createStationMutation.mutateAsync(data)
      setIsAddDialogOpen(false)
    },
    [createStationMutation],
  )

  const editStation = useCallback(
    async (station: ChargingStation) => {
      const formData = await loadStationFormData(station.id)
      setSelectedStation({
        ...formData,
        existingGallery: formData.existingGallery,
      })
      setSelectedStationId(station.id)
      setIsEditDialogOpen(true)
    },
    [],
  )

  const updateStation = useCallback(
    async (data: ChargingStationFormWithWork) => {
      if (!selectedStationId) {
        throw new Error('No charging station selected for update')
      }

      const payload = mapUpdatePayload(selectedStationId, teamGroupId, data)
      await updateStationMutation.mutateAsync(payload)
      setSelectedStation(null)
      setSelectedStationId(null)
      setIsEditDialogOpen(false)
    },
    [selectedStationId, teamGroupId, updateStationMutation],
  )

  const confirmDelete = useCallback(async () => {
    if (!stationToDelete) return

    await deleteStationMutation.mutateAsync(stationToDelete.id)
    setStationToDelete(null)
    setIsDeleteDialogOpen(false)
  }, [deleteStationMutation, stationToDelete])

  const resetEditState = useCallback(() => {
    setIsEditSuccessDialogOpen(false)
    setSelectedStation(null)
    setSelectedStationId(null)
    setIsEditDialogOpen(false)
  }, [])

  const onPageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size)
      setCurrentPage(1)
    },
    [],
  )

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const onSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, [])

  const openDeleteDialog = useCallback((station: ChargingStation) => {
    setStationToDelete(station)
    setIsDeleteDialogOpen(true)
  }, [])

  const onDeleteDialogChange = useCallback((open: boolean) => {
    setIsDeleteDialogOpen(open)
    if (!open) {
      setStationToDelete(null)
    }
  }, [])

  const openEditSuccessDialog = useCallback(() => {
    setIsEditSuccessDialogOpen(true)
  }, [])

  const closeEditSuccessDialog = useCallback(() => {
    resetEditState()
  }, [resetEditState])

  const onEditSuccessDialogChange = useCallback(
    (open: boolean) => {
      if (open) {
        setIsEditSuccessDialogOpen(true)
        return
      }
      resetEditState()
    },
    [resetEditState],
  )

  return {
    pagination: {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      onPageChange,
      onPageSizeChange,
    },
    search: {
      query: searchQuery,
      onChange: onSearchChange,
    },
    dialogs: {
      add: {
        isOpen: isAddDialogOpen,
        open: () => setIsAddDialogOpen(true),
        close: () => setIsAddDialogOpen(false),
        onOpenChange: setIsAddDialogOpen,
      },
      edit: {
        isOpen: isEditDialogOpen,
        close: () => setIsEditDialogOpen(false),
        onOpenChange: setIsEditDialogOpen,
      },
      delete: {
        isOpen: isDeleteDialogOpen,
        open: openDeleteDialog,
        close: () => setIsDeleteDialogOpen(false),
        onOpenChange: onDeleteDialogChange,
      },
      editSuccess: {
        isOpen: isEditSuccessDialogOpen,
        open: openEditSuccessDialog,
        close: closeEditSuccessDialog,
        onOpenChange: onEditSuccessDialogChange,
      },
    },
    selection: {
      stationToDelete,
      selectedStation,
      selectedStationId,
    },
    data: {
      chargingStations,
      isLoading,
      error,
    },
    status: {
      isDeleting: deleteStationMutation.status === 'pending',
    },
    actions: {
      addStation,
      editStation,
      updateStation,
      confirmDelete,
      formatDateTime: formatStationDateTime,
      resetEditState,
    },
  }
}
