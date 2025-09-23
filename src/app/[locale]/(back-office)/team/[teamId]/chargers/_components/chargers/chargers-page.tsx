'use client'
import {
  ChargersTable,
  OcppUrlDialog,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_components/chargers'
import { ConnectorsTable } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_components/connectors'
import { TeamHeader } from '@/app/[locale]/(back-office)/team/_components/team-header'
import { DeleteConfirmDialog } from '@/components/notifications'

import { EditChargerDialog } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_components/chargers/edit-charger-dialog'
import EditConnectorDialog from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_components/connectors/edit-connector-dialog'
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
import { AddChargerDialog } from '../chargers/add-charger-dialog'
import AddConnectorDialog from '../connectors/add-connector-dialog'

import type { EditChargerInitialValues } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_schemas/chargers.schema'
import { deleteCharger } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_servers/charger'
import type {
  ConnectorListItem,
  ConnectorSelectItem,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_servers/connectors'
import { TeamTabMenu } from '@/app/[locale]/(back-office)/team/_components/team-tab-menu'
import { useChargersList } from '@/hooks/use-chargers'
import { useConnectorsList, useDeleteConnector } from '@/hooks/use-connectors'
import { useI18n } from '@/lib/i18n'
import { Plus, Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface ChargersPageProps {
  teamId: string
  locale: string
  page?: string
  pageSize?: string
}

export function ChargersPage({ teamId, locale, page, pageSize }: ChargersPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const stationIdParam = searchParams.get('station_id') || undefined
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])
  // Initialize pagination states from props or URL params
  const [currentPage, setCurrentPage] = useState(() => {
    return page || searchParams.get('page') || '1'
  })
  const [pageSizeState, setPageSize] = useState(() => {
    return pageSize || searchParams.get('pageSize') || '10'
  })
  const { t } = useI18n()

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addConnectorDialogOpen, setAddConnectorDialogOpen] = useState(false)
  const [editConnectorDialogOpen, setEditConnectorDialogOpen] = useState(false)
  const [selectedConnectorData, setSelectedConnectorData] = useState<ConnectorListItem | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editChargerInitialValues, setEditChargerInitialValues] =
    useState<EditChargerInitialValues | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | number | null>(null)
  const [pendingDeleteConnectorId, setPendingDeleteConnectorId] = useState<string | number | null>(
    null,
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [setPriceDialogFromTableOpen, setsetPriceDialogFromTableOpen] = useState(false)
  const [setPriceDialogOpen, setsetPriceDialogOpen] = useState(false)
  const [selectedConnectorForPricing, setSelectedConnectorForPricing] =
    useState<ConnectorListItem | null>(null)
  const [ocppDialogOpen, setOcppDialogOpen] = useState(false)
  const [ocppUrl, setOcppUrl] = useState('')
  const ocppUrlInputRef = useRef<HTMLInputElement>(null)
  const [isSetIntegrationMode, setIsSetIntegrationMode] = useState(false)

  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam === 'connectors' ? 'connectors' : 'chargers')

  // Consolidated search and filter state management
  const [filters, setFilters] = useState({
    searchTerm: '',
    debouncedSearchTerm: '',
    statusFilter: '',
    isSearching: false,
  })

  const { searchTerm, debouncedSearchTerm, statusFilter, isSearching } = filters

  const chargerIdParam = searchParams.get('charger_id') || undefined
  const updateURLParams = useCallback(
    (page: string, size: string) => {
      const nextParams = new URLSearchParams(searchParams.toString())
      nextParams.set('page', page)
      nextParams.set('pageSize', size)
      // Preserve station filter if present
      if (stationIdParam) nextParams.set('station_id', stationIdParam)
      else nextParams.delete('station_id')
      // Preserve charger filter if present
      if (chargerIdParam) nextParams.set('charger_id', chargerIdParam)
      else nextParams.delete('charger_id')
      // Preserve active tab
      if (activeTab) nextParams.set('tab', activeTab)

      const currentPath = window.location.pathname
      const newUrl = `${currentPath}?${nextParams.toString()}`

      window.history.replaceState({}, '', newUrl)
      router.replace(newUrl, { scroll: false })
    },
    [router, searchParams, stationIdParam, chargerIdParam, activeTab],
  )

  // Helper function to map API accessibility values to form values
  const mapApiAccessToForm = (apiAccess: string | null): string => {
    if (!apiAccess) return ''

    // Handle both string names and numeric values from API
    const access = apiAccess.toString().trim().toLowerCase()

    switch (access) {
      case 'public':
      case '1':
        return '1'
      case 'private':
      case '2':
        return '2'
      case 'unavailable':
      case '3':
        return '3'
      default:
        return ''
    }
  }

  // Initialize URL on first load
  useEffect(() => {
    updateURLParams(currentPage, pageSizeState)
  }, [currentPage, pageSizeState, updateURLParams])

  // Reflect active tab in URL when it changes
  useEffect(() => {
    updateURLParams(currentPage, pageSizeState)
  }, [activeTab, currentPage, pageSizeState, updateURLParams])

  // Sync activeTab with URL `tab` param when it changes (e.g., via router.push)
  useEffect(() => {
    const urlTab = searchParams.get('tab')
    if (urlTab === 'connectors' || urlTab === 'chargers') {
      if (urlTab !== activeTab) {
        setActiveTab(urlTab)
      }
    }
  }, [searchParams])

  // Debounce search term for server-side filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        debouncedSearchTerm: searchTerm,
        isSearching: false,
      }))
    }, 500) // 500ms debounce

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

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    if (debouncedSearchTerm || statusFilter) {
      setCurrentPage('1')
      updateURLParams('1', pageSizeState)
    }
  }, [debouncedSearchTerm, statusFilter, pageSizeState, updateURLParams])

  // Parse current page and pageSize to numbers for calculations
  const currentPageNum = parseInt(currentPage, 10)
  const pageSizeNum = parseInt(pageSizeState, 10)

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
    enabled: isClient && (!!stationIdParam ? !Number.isNaN(parseInt(stationIdParam, 10)) : true),
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
    enabled: isClient && (!!chargerIdParam ? !Number.isNaN(parseInt(chargerIdParam, 10)) : true),
  })

  // Delete connector mutation
  const deleteConnectorMutation = useDeleteConnector()

  // Extract and calculate data with memoization for performance
  const chargers = chargersData?.data?.data || []
  const totalItems = chargersData?.data?.item_total || 0
  const totalPages = useMemo(() => {
    if (totalItems <= 0) return 0
    return Math.ceil(totalItems / pageSizeNum)
  }, [totalItems, pageSizeNum])

  const connectors = connectorsData?.data?.data || []
  const connectorTotalItems = connectorsData?.data?.item_total || 0
  const connectorTotalPages = useMemo(() => {
    if (connectorTotalItems <= 0) return 0
    return Math.ceil(connectorTotalItems / pageSizeNum)
  }, [connectorTotalItems, pageSizeNum])

  // Clear all filters function - reusable
  const clearAllFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      debouncedSearchTerm: '',
      statusFilter: '',
      isSearching: false,
    })
  }, [])

  // Handle charger editing
  const handleEditCharger = (editChargerData: EditChargerInitialValues) => {
    setEditChargerInitialValues(editChargerData)
    setEditDialogOpen(true)
  }

  // Handle Set Integration callback
  const handleSetIntegration = async (chargerId: number) => {
    // Find the charger in the current list
    const charger = chargers.find((c) => c.id === chargerId)
    if (!charger) {
      console.error('Charger not found:', chargerId)
      return
    }

    // Use the edit functionality but with integration mode
    setIsSetIntegrationMode(true)

    // Trigger the edit process which will fetch detailed data and open dialog
    handleEditCharger({
      id: charger.id?.toString(),
      chargerName: charger.name ?? '',
      chargerAccess: charger.charger_access ?? '',
      selectedBrand:
        charger.brand_id !== undefined && charger.brand_id !== null ? String(charger.brand_id) : '',
      selectedModel:
        charger.model_id !== undefined && charger.model_id !== null ? String(charger.model_id) : '',
      typeConnector: charger.type_connector ?? '',
      selectedPowerLevel: charger.power_level ?? '',
      selectedChargingStation:
        charger.station_id !== undefined && charger.station_id !== null
          ? String(charger.station_id)
          : '',
      serialNumber: charger.serial_number ?? '',
    })
  }

  // Handle charger delete
  const handleDeleteCharger = (chargerId: string | number | undefined) => {
    if (!chargerId) return
    setPendingDeleteId(chargerId)
    setDeleteDialogOpen(true)
  }

  // Handle search input change with instant UI feedback
  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: value,
      isSearching: value.trim() ? true : prev.isSearching,
    }))
  }

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      statusFilter: value === 'all' ? '' : value,
    }))
  }

  // Pagination logic with memoized calculations
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

  // Handle page change (used for both tabs)
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (
        newPage >= 1 &&
        newPage <= paginationData.totalPagesForTab &&
        paginationData.totalPagesForTab > 0
      ) {
        setCurrentPage(newPage.toString())
        updateURLParams(newPage.toString(), pageSizeState)
      }
    },
    [paginationData.totalPagesForTab, pageSizeState, updateURLParams],
  )

  // Handle page size change (used for both tabs)
  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize.toString())
      setCurrentPage('1') // Reset to first page when changing page size
      updateURLParams('1', newPageSize.toString())
    },
    [updateURLParams],
  )

  const handleDeleteConnector = (connectorId: string | number | undefined) => {
    if (!connectorId) return
    setPendingDeleteConnectorId(connectorId)
    setDeleteDialogOpen(true)
  }

  const handleEditConnector = (connector: ConnectorListItem) => {
    setSelectedConnectorData(connector)
    setEditConnectorDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      // Delete charger
      setIsDeleting(true)
      try {
        await deleteCharger(pendingDeleteId)
        setDeleteDialogOpen(false)
        setPendingDeleteId(null)
        refetchChargers()
      } catch (err) {
        console.error('Failed to delete charger:', err)
        setDeleteDialogOpen(false)
        setPendingDeleteId(null)
      } finally {
        setIsDeleting(false)
      }
    } else if (pendingDeleteConnectorId) {
      // Delete connector using mutation
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

  useEffect(() => {
    if (
      !isLoading &&
      !isConnectorsLoading &&
      paginationData.totalPagesForTab > 0 &&
      currentPageNum > paginationData.totalPagesForTab
    ) {
      setCurrentPage(paginationData.totalPagesForTab.toString())
      updateURLParams(paginationData.totalPagesForTab.toString(), pageSizeState)
    }
  }, [
    currentPageNum,
    paginationData.totalPagesForTab,
    isLoading,
    isConnectorsLoading,
    pageSizeState,
    updateURLParams,
  ])

  return (
    <div className="space-y-6 p-4">
      {/* Header Section */}
      <TeamHeader teamId={teamId} pageTitle={t('team_tabs.chargers')} />

      {/* Navigation Tabs Section */}
      <div className="">
        <TeamTabMenu active="chargers" locale={locale} teamId={teamId} />
      </div>

      {/* Main Content Section */}
      <div className="flex-1">
        <div className="rounded-lg bg-card">
          {/* Search, Filter, and Tabs Section */}
          <div className="p-2 md:p-4">
            {/* Tabs Section with full-width border */}
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

            {/* Controls Section */}
            <div className="mt-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              {/* Left side: Search and Filter */}
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                {/* Search Input */}
                <div className="relative max-w-[240px]">
                  <Input
                    placeholder={`${t('common.search')}${activeTab === 'connectors' ? t('connectors.connectors_name') : t('chargers.chargers_name')}`}
                    className="h-10 w-full border bg-[#ECF2F8] pl-3 pr-9 text-xs placeholder:text-xs placeholder:font-medium placeholder:text-[#A1B1D1] sm:pl-4 sm:pr-10 sm:text-sm sm:placeholder:text-sm"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#A1B1D1]">
                    <Search className="h-4 w-4" />
                  </span>
                </div>

                {/* Filter Button */}
                <Select
                  value={statusFilter || 'all'}
                  onValueChange={(v) => handleStatusFilterChange(v)}
                >
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

              {/* Right side: Action Buttons */}
              <div className="flex gap-2">
                {activeTab === 'connectors' && (
                  <>
                    <Button
                      variant="darkwhite"
                      className="h-10 rounded-lg px-6 text-sm"
                      onClick={() => {
                        setsetPriceDialogOpen(true)
                      }}
                    >
                      {t('buttons.set-price')}
                    </Button>
                    <Button
                      variant="default"
                      className="h-10 px-6 text-xs sm:h-10 sm:text-sm"
                      onClick={() => setAddConnectorDialogOpen(true)}
                    >
                      <Plus className="size-4" />
                      {t('buttons.add')}
                    </Button>
                    <AddConnectorDialog
                      open={addConnectorDialogOpen}
                      onOpenChange={(open) => {
                        setAddConnectorDialogOpen(open)
                        if (!open) {
                          refetchConnectors()
                        }
                      }}
                      teamId={teamId}
                    />
                  </>
                )}
                {activeTab !== 'connectors' && (
                  <Button
                    variant="default"
                    className="h-10 sm:h-10 sm:text-sm"
                    onClick={() => setAddDialogOpen(true)}
                  >
                    <Plus className="h-3 w-3" />
                    {t('buttons.add')}
                  </Button>
                )}
              </div>
            </div>
            <Separator className="my-4" />
          </div>

          {/* Table Section - Switch by Tab */}
          {activeTab === 'chargers' ? (
            <ChargersTable
              chargers={chargers}
              isLoading={isLoading}
              debouncedSearchTerm={debouncedSearchTerm}
              statusFilter={statusFilter}
              clearAllFilters={clearAllFilters}
              onEditCharger={handleEditCharger}
              onSetIntegration={handleSetIntegration}
              onDeleteCharger={handleDeleteCharger}
              teamId={teamId}
              currentPage={currentPage}
              pageSize={pageSizeState}
            />
          ) : (
            <ConnectorsTable
              connectors={connectors}
              isConnectorsLoading={isConnectorsLoading}
              connectorsError={connectorsError}
              debouncedSearchTerm={debouncedSearchTerm}
              statusFilter={statusFilter}
              clearAllFilters={clearAllFilters}
              setSelectedConnectorForPricing={setSelectedConnectorForPricing}
              setsetPriceDialogFromTableOpen={setsetPriceDialogFromTableOpen}
              handleEditConnector={handleEditConnector}
              handleDeleteConnector={handleDeleteConnector}
            />
          )}

          {/* Pagination Section - Enhanced for better mobile experience */}
          <div className="my-4 border-gray-200 bg-card px-4 py-4 md:px-6">
            {/* Active filters indicator */}
            {(debouncedSearchTerm || statusFilter) && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-600">Active filters:</span>
                {debouncedSearchTerm && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    Search: &ldquo;{debouncedSearchTerm}&rdquo;
                    <button
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          searchTerm: '',
                          debouncedSearchTerm: '',
                        }))
                      }}
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
                      onClick={() => setFilters((prev) => ({ ...prev, statusFilter: '' }))}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
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
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
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
                {/* Previous Button */}
                <Button
                  variant={'ghost'}
                  size="icon"
                  className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9"
                  disabled={currentPageNum === 1 || isLoading || isConnectorsLoading}
                  onClick={() => handlePageChange(currentPageNum - 1)}
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

                {/* Page Numbers */}
                {(() => {
                  const current = currentPageNum
                  const total = paginationData.totalPagesForTab
                  const pages = []

                  // Don't show page numbers if no data or loading
                  if (
                    total <= 0 ||
                    (activeTab === 'chargers' && isLoading) ||
                    (activeTab === 'connectors' && isConnectorsLoading)
                  ) {
                    return null
                  }

                  // Always show first page
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
                        onClick={() => handlePageChange(1)}
                      >
                        <span className="text-xs font-medium sm:text-sm">1</span>
                      </Button>,
                    )
                  }

                  // Show ellipsis if current page is far from start
                  if (current > 4) {
                    pages.push(
                      <span key="start-ellipsis" className="px-2 text-xs text-gray-500 sm:text-sm">
                        ...
                      </span>,
                    )
                  }

                  // Show pages around current page
                  const start = Math.max(2, current - 1)
                  const end = Math.min(total - 1, current + 1)

                  for (let i = start; i <= end; i++) {
                    if (i > 1 && i < total) {
                      pages.push(
                        <Button
                          key={i}
                          variant={current === i ? 'default' : 'ghost'}
                          size="icon"
                          className={`h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 ${
                            current === i
                              ? 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary'
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handlePageChange(i)}
                        >
                          <span className="text-xs font-medium sm:text-sm">{i}</span>
                        </Button>,
                      )
                    }
                  }

                  // Show ellipsis if current page is far from end
                  if (current < total - 3) {
                    pages.push(
                      <span key="end-ellipsis" className="px-2 text-xs text-gray-500 sm:text-sm">
                        ...
                      </span>,
                    )
                  }

                  // Always show last page (if more than 1 page)
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
                        onClick={() => handlePageChange(total)}
                      >
                        <span className="text-xs font-medium sm:text-sm">{total}</span>
                      </Button>,
                    )
                  }

                  return pages
                })()}

                {/* Next Button */}
                <Button
                  variant={'ghost'}
                  size="icon"
                  className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9"
                  disabled={
                    currentPageNum === paginationData.totalPagesForTab ||
                    isLoading ||
                    isConnectorsLoading
                  }
                  onClick={() => handlePageChange(currentPageNum + 1)}
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

      {/* Add the AddChargerDialog component with controlled open state */}
      <AddChargerDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open)
          if (!open) {
            refetchChargers()
          }
        }}
        teamGroupId={teamId}
      />

      <SetPriceDialogFormTable
        open={setPriceDialogFromTableOpen}
        onOpenChange={(open) => {
          setsetPriceDialogFromTableOpen(open)
          if (!open) {
            setSelectedConnectorForPricing(null)
          }
        }}
        onConfirm={(_selectedPriceGroup) => {
          // Add your price setting logic here
        }}
        initialSelectedConnectors={
          selectedConnectorForPricing
            ? [selectedConnectorForPricing as unknown as ConnectorSelectItem]
            : []
        }
      />

      <SetPriceDialog
        open={setPriceDialogOpen}
        onOpenChange={(open) => {
          setsetPriceDialogOpen(open)
        }}
        onConfirm={(_selectedPriceGroup) => {
          // Add your price setting logic here
        }}
      />

      {/* OCPP URL Dialog - Controlled by state */}
      <OcppUrlDialog
        open={ocppDialogOpen}
        onOpenChange={setOcppDialogOpen}
        ocppUrl={ocppUrl}
        setOcppUrl={setOcppUrl}
        ocppUrlInputRef={ocppUrlInputRef as React.RefObject<HTMLInputElement>}
      />
      <EditChargerDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) {
            setEditChargerInitialValues(null)
            setIsSetIntegrationMode(false)
            refetchChargers()
          }
        }}
        teamGroupId={teamId}
        initialValues={editChargerInitialValues ?? undefined}
        initialStep={isSetIntegrationMode ? 2 : 1}
      />
      <EditConnectorDialog
        open={editConnectorDialogOpen}
        onOpenChange={(open) => {
          setEditConnectorDialogOpen(open)
          if (!open) {
            setSelectedConnectorData(null)
          }
        }}
        teamId={teamId}
        connectorData={selectedConnectorData ?? undefined}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) {
            setPendingDeleteId(null)
            setPendingDeleteConnectorId(null)
          }
        }}
        description={
          pendingDeleteId
            ? 'Are you sure you want to delete this charger?'
            : 'Are you sure you want to delete this connector?'
        }
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
