'use client'

import { deleteCharger } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_servers/charger'
import type {
  ConnectorListItem,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_servers/connectors'
import { useChargersList } from '@/hooks/use-chargers'
import { useConnectorsList, useDeleteConnector } from '@/hooks/use-connectors'
import { useI18n } from '@/lib/i18n'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'

import type {
  ChargerListItem,
  EditChargerInitialValues,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_schemas/chargers.schema'

interface UseChargersPageControllerProps {
  teamId: string
  page?: string
  pageSize?: string
}

type ActiveTab = 'chargers' | 'connectors'

type PricingState = {
  fromTableOpen: boolean
  onFromTableOpenChange: (open: boolean) => void
  dialogOpen: boolean
  onDialogOpenChange: (open: boolean) => void
  selectedConnector: ConnectorListItem | null
  setSelectedConnector: (connector: ConnectorListItem | null) => void
}

type DialogState = {
  addCharger: {
    open: boolean
    onOpenChange: (open: boolean) => void
  }
  addConnector: {
    open: boolean
    onOpenChange: (open: boolean) => void
  }
  editConnector: {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: ConnectorListItem | null
  }
  editCharger: {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialValues: EditChargerInitialValues | null
    initialStep: number
  }
  deleteConfirm: {
    open: boolean
    onOpenChange: (open: boolean) => void
  }
}

type PaginationState = {
  currentPage: string
  currentPageNum: number
  pageSize: string
  pageSizeNum: number
  data: {
    totalPagesForTab: number
    totalItemsForTab: number
    showingFrom: number
    showingTo: number
  }
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

type FiltersState = {
  searchTerm: string
  debouncedSearchTerm: string
  statusFilter: string
  isSearching: boolean
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  clearAll: () => void
  clearSearch: () => void
  clearStatus: () => void
}

type ChargersQueryState = {
  items: ChargerListItem[]
  isLoading: boolean
  refetch: () => Promise<unknown>
}

type ConnectorsQueryState = {
  items: ConnectorListItem[]
  isLoading: boolean
  error: unknown
  refetch: () => Promise<unknown>
}

type OcppState = {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  url: string
  setUrl: (value: string) => void
  inputRef: RefObject<HTMLInputElement>
}

type ActionsState = {
  onEditCharger: (editChargerData: EditChargerInitialValues) => void
  onSetIntegration: (chargerId: number) => void
  onDeleteCharger: (chargerId: string | number | undefined) => void
  onEditConnector: (connector: ConnectorListItem) => void
  onDeleteConnector: (connectorId: string | number | undefined) => void
  onConfirmDelete: () => void
}

type DeletionState = {
  isDeleting: boolean
  target: 'charger' | 'connector' | null
}

type UseChargersPageControllerResult = {
  i18n: {
    t: ReturnType<typeof useI18n>['t']
  }
  tabs: {
    active: ActiveTab
    setActive: (tab: ActiveTab) => void
  }
  filters: FiltersState
  pagination: PaginationState
  chargers: ChargersQueryState
  connectors: ConnectorsQueryState
  dialogs: DialogState
  pricing: PricingState
  ocpp: OcppState
  actions: ActionsState
  deletion: DeletionState
}

export function useChargersPageController({
  teamId,
  page,
  pageSize,
}: UseChargersPageControllerProps): UseChargersPageControllerResult {
  const router = useRouter()
  const searchParams = useSearchParams()
  const stationIdParam = searchParams.get('station_id') || undefined
  const chargerIdParam = searchParams.get('charger_id') || undefined
  const tabParam = searchParams.get('tab')

  const { t } = useI18n()

  const [currentPage, setCurrentPage] = useState(() => page || searchParams.get('page') || '1')
  const [pageSizeState, setPageSizeState] = useState(() => pageSize || searchParams.get('pageSize') || '10')
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    tabParam === 'connectors' ? 'connectors' : 'chargers',
  )
  const [filters, setFilters] = useState({
    searchTerm: '',
    debouncedSearchTerm: '',
    statusFilter: '',
    isSearching: false,
  })

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addConnectorDialogOpen, setAddConnectorDialogOpen] = useState(false)
  const [editConnectorDialogOpen, setEditConnectorDialogOpen] = useState(false)
  const [selectedConnectorData, setSelectedConnectorData] = useState<ConnectorListItem | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editChargerInitialValues, setEditChargerInitialValues] =
    useState<EditChargerInitialValues | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | number | null>(null)
  const [pendingDeleteConnectorId, setPendingDeleteConnectorId] =
    useState<string | number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPriceDialogFromTableOpen, setIsPriceDialogFromTableOpen] = useState(false)
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false)
  const [selectedConnectorForPricing, setSelectedConnectorForPricing] =
    useState<ConnectorListItem | null>(null)
  const [ocppDialogOpen, setOcppDialogOpen] = useState(false)
  const [ocppUrl, setOcppUrl] = useState('')
  const ocppUrlInputRef = useRef<HTMLInputElement>(null)
  const [isSetIntegrationMode, setIsSetIntegrationMode] = useState(false)

  const { searchTerm, debouncedSearchTerm, statusFilter, isSearching } = filters

  const updateURLParams = useCallback(
    (pageValue: string, pageSizeValue: string, tabValue?: ActiveTab) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', pageValue)
      params.set('pageSize', pageSizeValue)

      if (stationIdParam) params.set('station_id', stationIdParam)
      else params.delete('station_id')

      if (chargerIdParam) params.set('charger_id', chargerIdParam)
      else params.delete('charger_id')

      const nextTab = tabValue ?? activeTab
      if (nextTab) params.set('tab', nextTab)

      const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
      const queryString = params.toString()
      const newUrl = queryString ? `${currentPath}?${queryString}` : currentPath

      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', newUrl)
      }
      router.replace(newUrl, { scroll: false })
    },
    [activeTab, chargerIdParam, router, searchParams, stationIdParam],
  )

  useEffect(() => {
    updateURLParams(currentPage, pageSizeState)
  }, [currentPage, pageSizeState, updateURLParams])

  useEffect(() => {
    updateURLParams(currentPage, pageSizeState, activeTab)
  }, [activeTab, currentPage, pageSizeState, updateURLParams])

  useEffect(() => {
    const urlTab = searchParams.get('tab')
    if (urlTab === 'connectors' || urlTab === 'chargers') {
      if (urlTab !== activeTab) {
        setActiveTab(urlTab)
      }
    }
  }, [activeTab, searchParams])

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        debouncedSearchTerm: searchTerm,
        isSearching: false,
      }))
    }, 500)

    if (searchTerm) {
      setFilters((prev) => ({ ...prev, isSearching: true }))
    }

    return () => {
      clearTimeout(timer)
      if (searchTerm) {
        setFilters((prev) => ({ ...prev, isSearching: false }))
      }
    }
  }, [searchTerm])

  useEffect(() => {
    if (debouncedSearchTerm || statusFilter) {
      setCurrentPage('1')
      updateURLParams('1', pageSizeState)
    }
  }, [debouncedSearchTerm, statusFilter, pageSizeState, updateURLParams])

  const currentPageNum = Number.isNaN(parseInt(currentPage, 10))
    ? 1
    : parseInt(currentPage, 10)
  const pageSizeNum = Number.isNaN(parseInt(pageSizeState, 10))
    ? 10
    : parseInt(pageSizeState, 10)

  const {
    data: chargersData,
    isLoading,
    refetch: refetchChargers,
  } = useChargersList(teamId, currentPage, pageSizeState, {
    enableRealtime: true,
    refetchInterval: 30000,
    search: debouncedSearchTerm,
    status: statusFilter,
    stationId: stationIdParam,
    enabled: !!teamId && (!!stationIdParam ? !Number.isNaN(parseInt(stationIdParam, 10)) : true),
  })

  const {
    data: connectorsData,
    isLoading: isConnectorsLoading,
    error: connectorsError,
    refetch: refetchConnectors,
  } = useConnectorsList(teamId, currentPage, pageSizeState, {
    enableRealtime: true,
    refetchInterval: 30000,
    search: debouncedSearchTerm,
    status: statusFilter,
    chargerId: chargerIdParam,
    enabled: !!teamId && (!!chargerIdParam ? !Number.isNaN(parseInt(chargerIdParam, 10)) : true),
  })

  const deleteConnectorMutation = useDeleteConnector()

  const chargers = chargersData?.data?.data ?? []
  const totalItems = chargersData?.data?.item_total ?? 0
  const totalPages = useMemo(() => {
    if (totalItems <= 0) return 0
    return Math.ceil(totalItems / pageSizeNum)
  }, [totalItems, pageSizeNum])

  const connectors = (connectorsData?.data?.data as ConnectorListItem[]) ?? []
  const connectorTotalItems = connectorsData?.data?.item_total ?? 0
  const connectorTotalPages = useMemo(() => {
    if (connectorTotalItems <= 0) return 0
    return Math.ceil(connectorTotalItems / pageSizeNum)
  }, [connectorTotalItems, pageSizeNum])

  const paginationData = useMemo(() => {
    const totalPagesForTab = activeTab === 'chargers' ? totalPages : connectorTotalPages
    const totalItemsForTab = activeTab === 'chargers' ? totalItems : connectorTotalItems

    return {
      totalPagesForTab,
      totalItemsForTab,
      showingFrom: (currentPageNum - 1) * pageSizeNum + 1,
      showingTo: Math.min(currentPageNum * pageSizeNum, totalItemsForTab),
    }
  }, [
    activeTab,
    totalPages,
    connectorTotalPages,
    totalItems,
    connectorTotalItems,
    currentPageNum,
    pageSizeNum,
  ])

  useEffect(() => {
    if (
      !isLoading &&
      !isConnectorsLoading &&
      paginationData.totalPagesForTab > 0 &&
      currentPageNum > paginationData.totalPagesForTab
    ) {
      const fallbackPage = paginationData.totalPagesForTab.toString()
      setCurrentPage(fallbackPage)
      updateURLParams(fallbackPage, pageSizeState)
    }
  }, [
    currentPageNum,
    paginationData.totalPagesForTab,
    isLoading,
    isConnectorsLoading,
    pageSizeState,
    updateURLParams,
  ])

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: value,
      isSearching: value.trim() ? true : prev.isSearching,
    }))
  }

  const handleStatusFilterChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      statusFilter: value === 'all' ? '' : value,
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      debouncedSearchTerm: '',
      statusFilter: '',
      isSearching: false,
    })
  }

  const clearSearchFilter = () => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: '',
      debouncedSearchTerm: '',
    }))
  }

  const clearStatusFilter = () => {
    setFilters((prev) => ({
      ...prev,
      statusFilter: '',
    }))
  }

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (
        newPage >= 1 &&
        newPage <= paginationData.totalPagesForTab &&
        paginationData.totalPagesForTab > 0
      ) {
        const nextPage = newPage.toString()
        setCurrentPage(nextPage)
        updateURLParams(nextPage, pageSizeState)
      }
    },
    [paginationData.totalPagesForTab, pageSizeState, updateURLParams],
  )

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      const pageSizeString = newPageSize.toString()
      setPageSizeState(pageSizeString)
      setCurrentPage('1')
      updateURLParams('1', pageSizeString)
    },
    [updateURLParams],
  )

  const handleEditCharger = (editChargerData: EditChargerInitialValues) => {
    setEditChargerInitialValues(editChargerData)
    setEditDialogOpen(true)
  }

  const handleSetIntegration = async (chargerId: number) => {
    const charger = chargers.find((c) => c && typeof c === 'object' && 'id' in c && (c as { id: number }).id === chargerId)
    if (!charger || typeof charger !== 'object') {
      console.error('Charger not found:', chargerId)
      return
    }

    setIsSetIntegrationMode(true)

    const typedCharger = charger as {
      id?: number
      name?: string | null
      charger_access?: string | null
      brand_id?: number | null
      model_id?: number | null
      type_connector?: string | null
      power_level?: string | null
      station_id?: number | null
      serial_number?: string | null
    }

    handleEditCharger({
      id: typedCharger.id?.toString(),
      chargerName: typedCharger.name ?? '',
      chargerAccess: typedCharger.charger_access ?? '',
      selectedBrand:
        typedCharger.brand_id !== undefined && typedCharger.brand_id !== null
          ? String(typedCharger.brand_id)
          : '',
      selectedModel:
        typedCharger.model_id !== undefined && typedCharger.model_id !== null
          ? String(typedCharger.model_id)
          : '',
      typeConnector: typedCharger.type_connector ?? '',
      selectedPowerLevel: typedCharger.power_level ?? '',
      selectedChargingStation:
        typedCharger.station_id !== undefined && typedCharger.station_id !== null
          ? String(typedCharger.station_id)
          : '',
      serialNumber: typedCharger.serial_number ?? '',
    })
  }

  const handleDeleteCharger = (chargerId: string | number | undefined) => {
    if (!chargerId) return
    setPendingDeleteId(chargerId)
    setPendingDeleteConnectorId(null)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConnector = (connectorId: string | number | undefined) => {
    if (!connectorId) return
    setPendingDeleteConnectorId(connectorId)
    setPendingDeleteId(null)
    setDeleteDialogOpen(true)
  }

  const handleEditConnector = (connector: ConnectorListItem) => {
    setSelectedConnectorData(connector)
    setEditConnectorDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      setIsDeleting(true)
      try {
        await deleteCharger(pendingDeleteId)
        setDeleteDialogOpen(false)
        setPendingDeleteId(null)
        refetchChargers()
      } catch (error) {
        console.error('Failed to delete charger:', error)
        setDeleteDialogOpen(false)
        setPendingDeleteId(null)
      } finally {
        setIsDeleting(false)
      }
    } else if (pendingDeleteConnectorId) {
      setIsDeleting(true)
      deleteConnectorMutation.mutate(pendingDeleteConnectorId, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setPendingDeleteConnectorId(null)
        },
        onError: (error) => {
          console.error('Failed to delete connector:', error)
          setDeleteDialogOpen(false)
          setPendingDeleteConnectorId(null)
        },
        onSettled: () => {
          setIsDeleting(false)
        },
      })
    }
  }

  const handleAddDialogOpenChange = (open: boolean) => {
    setAddDialogOpen(open)
    if (!open) {
      refetchChargers()
    }
  }

  const handleAddConnectorDialogOpenChange = (open: boolean) => {
    setAddConnectorDialogOpen(open)
    if (!open) {
      refetchConnectors()
    }
  }

  const handleEditConnectorDialogOpenChange = (open: boolean) => {
    setEditConnectorDialogOpen(open)
    if (!open) {
      setSelectedConnectorData(null)
    }
  }

  const handleEditDialogOpenChange = (open: boolean) => {
    setEditDialogOpen(open)
    if (!open) {
      setEditChargerInitialValues(null)
      setIsSetIntegrationMode(false)
      refetchChargers()
    }
  }

  const handleDeleteDialogOpenChange = (open: boolean) => {
    setDeleteDialogOpen(open)
    if (!open) {
      setPendingDeleteId(null)
      setPendingDeleteConnectorId(null)
    }
  }

  const handlePriceDialogFromTableChange = (open: boolean) => {
    setIsPriceDialogFromTableOpen(open)
    if (!open) {
      setSelectedConnectorForPricing(null)
    }
  }

  const handlePriceDialogOpenChange = (open: boolean) => {
    setIsPriceDialogOpen(open)
  }

  return {
    i18n: { t },
    tabs: {
      active: activeTab,
      setActive: setActiveTab,
    },
    filters: {
      searchTerm,
      debouncedSearchTerm,
      statusFilter,
      isSearching,
      onSearchChange: handleSearchChange,
      onStatusFilterChange: handleStatusFilterChange,
      clearAll: clearAllFilters,
      clearSearch: clearSearchFilter,
      clearStatus: clearStatusFilter,
    },
    pagination: {
      currentPage,
      currentPageNum,
      pageSize: pageSizeState,
      pageSizeNum,
      data: paginationData,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
    },
    chargers: {
      items: chargers,
      isLoading,
      refetch: refetchChargers,
    },
    connectors: {
      items: connectors,
      isLoading: isConnectorsLoading,
      error: connectorsError,
      refetch: refetchConnectors,
    },
    dialogs: {
      addCharger: {
        open: addDialogOpen,
        onOpenChange: handleAddDialogOpenChange,
      },
      addConnector: {
        open: addConnectorDialogOpen,
        onOpenChange: handleAddConnectorDialogOpenChange,
      },
      editConnector: {
        open: editConnectorDialogOpen,
        onOpenChange: handleEditConnectorDialogOpenChange,
        data: selectedConnectorData,
      },
      editCharger: {
        open: editDialogOpen,
        onOpenChange: handleEditDialogOpenChange,
        initialValues: editChargerInitialValues,
        initialStep: isSetIntegrationMode ? 2 : 1,
      },
      deleteConfirm: {
        open: deleteDialogOpen,
        onOpenChange: handleDeleteDialogOpenChange,
      },
    },
    pricing: {
      fromTableOpen: isPriceDialogFromTableOpen,
      onFromTableOpenChange: handlePriceDialogFromTableChange,
      dialogOpen: isPriceDialogOpen,
      onDialogOpenChange: handlePriceDialogOpenChange,
      selectedConnector: selectedConnectorForPricing,
      setSelectedConnector: setSelectedConnectorForPricing,
    },
    ocpp: {
      dialogOpen: ocppDialogOpen,
      setDialogOpen: setOcppDialogOpen,
      url: ocppUrl,
      setUrl: setOcppUrl,
      inputRef: ocppUrlInputRef,
    },
    actions: {
      onEditCharger: handleEditCharger,
      onSetIntegration: handleSetIntegration,
      onDeleteCharger: handleDeleteCharger,
      onEditConnector: handleEditConnector,
      onDeleteConnector: handleDeleteConnector,
      onConfirmDelete: handleConfirmDelete,
    },
    deletion: {
      isDeleting,
      target: pendingDeleteId ? 'charger' : pendingDeleteConnectorId ? 'connector' : null,
    },
  }
}
