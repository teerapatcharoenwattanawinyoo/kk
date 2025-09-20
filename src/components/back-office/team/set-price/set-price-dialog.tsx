'use client'
import {
  CreateByParentRequest,
  PriceGroup,
  createPriceSetByParent,
  getPriceSet,
} from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_servers/price-groups'
import { useTeamHostId } from '@/app/[locale]/(back-office)/team/_hooks/use-teams'
import { LocationPinIcon } from '@/components/icons/LocationPinIcon'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { QUERY_KEYS } from '@/lib/constants'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Check, Loader2, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  SelectConnectorDialog,
  SelectedConnectorsDisplay,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_components/connectors'
import type { ConnectorSelectItem } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_servers/connectors'
import { SuccessDialog } from '@/components/notifications'

interface SetPriceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: (selectedPriceGroup: PriceGroup) => void
  initialSelectedConnectors?: ConnectorSelectItem[]
}

export default function SetPriceDialog({
  open,
  onOpenChange,
  onConfirm,
  initialSelectedConnectors,
}: SetPriceDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showConnectorDialog, setShowConnectorDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [selectedConnectors, setSelectedConnectors] = useState<ConnectorSelectItem[]>([])
  const [isApplying, setIsApplying] = useState(false)
  const teamHostId = useTeamHostId()

  // Mutation for creating price set by parent
  const createPriceSetMutation = useMutation({
    mutationFn: (requestData: CreateByParentRequest) => createPriceSetByParent(requestData),
    onSuccess: (_response) => {
      setIsApplying(false)
      setShowSuccessDialog(true)
      setSelectedConnectors([])
      setShowConnectorDialog(false)
    },
    onError: (error) => {
      console.error('Price application error:', error)
      setIsApplying(false)
    },
  })

  // Use react-query directly to fetch price set data
  const {
    data: priceSetResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...QUERY_KEYS.PRICE_SET, 'general', 1, 100],
    queryFn: () => {
      return getPriceSet('general', 1, 100)
    },
    enabled: !!teamHostId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  // Extract deduplicated groups and total count from API response
  const dedupedGroups = priceSetResponse?.data?.data || []
  // const totalCount = priceSetResponse?.data?.count || 0;

  // Filter price groups based on search term
  const filteredPriceGroups = dedupedGroups.filter((group: PriceGroup) => {
    // If search term is empty, include all groups
    if (!searchTerm) return true

    // Safely check if name includes search term
    const groupName = group.name || ''
    return groupName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const [selectedPriceGroup, setSelectedPriceGroup] = useState<PriceGroup | null>(null)

  // Select first item by default when data loads
  useEffect(() => {
    if (filteredPriceGroups.length > 0 && !selectedPriceGroup) {
      setSelectedPriceGroup(filteredPriceGroups[0])
    }
  }, [filteredPriceGroups, selectedPriceGroup])

  // Reset states when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedConnectors([])
      setSelectedPriceGroup(null)
      setSearchTerm('')
      setShowSuccessDialog(false)
    }
  }, [open])

  // Set initial selected connectors when provided
  useEffect(() => {
    if (open && initialSelectedConnectors) {
      setSelectedConnectors(initialSelectedConnectors)
    }
  }, [open, initialSelectedConnectors])

  // Helper function to format price display
  const formatPriceDisplay = (group: PriceGroup) => {
    if (!group) return 'N/A'

    try {
      const prices = []

      // Handle different number formats safely
      if (group.price_per_kwh) {
        prices.push(`${group.price_per_kwh} THB/kWh`)
      }

      if (group.price_per_minute) {
        prices.push(`${group.price_per_minute} THB/min`)
      }

      // Add peak/off-peak prices if available
      if (group.price_on_peak && parseFloat(group.price_on_peak) > 0) {
        prices.push(`${group.price_on_peak} THB peak`)
      }

      if (group.price_off_peak && parseFloat(group.price_off_peak) > 0) {
        prices.push(`${group.price_off_peak} THB off-peak`)
      }

      return prices.length > 0 ? prices.join(', ') : 'No pricing information'
    } catch {
      return 'Price information unavailable'
    }
  }

  // Helper function to calculate applied stations count
  const getAppliedStationsCount = (group: PriceGroup) => {
    if (!group) return 0

    // Count how many items in dedupedGroups have the same name and parent_id but different station_id
    const relatedGroups = dedupedGroups.filter((item: PriceGroup) => {
      if (!item) return false

      const itemName = item.name || ''
      const groupName = group.name || ''

      // Compare parent_id safely (can be null)
      const sameParentId =
        (group.parent_id === null && item.parent_id === null) ||
        (group.parent_id !== null && item.parent_id !== null && group.parent_id === item.parent_id)

      return itemName === groupName && sameParentId
    })

    // Count unique station_ids (excluding null)
    const uniqueStations = new Set(
      relatedGroups
        .filter((item: PriceGroup) => item.station_id !== null && item.station_id !== undefined)
        .map((item: PriceGroup) => item.station_id),
    )

    return uniqueStations.size
  }

  const handleContinue = () => {
    if (selectedPriceGroup) {
      if (selectedConnectors.length > 0) {
        handleApplyPrice()
      } else {
        setShowConnectorDialog(true)
      }
    }
  }

  const handleApplyPrice = () => {
    if (!selectedPriceGroup || selectedConnectors.length === 0) {
      console.error('Missing required data for price application')
      return
    }

    // Prepare the request data
    const requestData: CreateByParentRequest = {
      parent_id: selectedPriceGroup.id,
      plug_id: selectedConnectors.map((connector) => connector.id),
    }

    setIsApplying(true)
    // Execute the mutation
    createPriceSetMutation.mutate(requestData)
  }

  const handleConnectorDialogBack = () => {
    setShowConnectorDialog(false)
  }

  const handleConnectorConfirm = (connectors: ConnectorSelectItem[]) => {
    setSelectedConnectors(connectors)
    setShowConnectorDialog(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    if (onConfirm && selectedPriceGroup) {
      onConfirm(selectedPriceGroup)
    }
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open && !showConnectorDialog && !showSuccessDialog} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[763px] gap-0 rounded-[20px] bg-card p-0">
          {/* Header with Title and Close Button */}
          <div className="flex items-center justify-between px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-[#355FF5]">
                Select price group
              </DialogTitle>
            </DialogHeader>
          </div>

          <Separator />
          {/* Description */}
          {/* Selected Connectors Section */}
          <SelectedConnectorsDisplay selectedConnectors={selectedConnectors} showSeparator={true} />
          {/* General Price Section and Search */}
          <div className="px-6 py-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="relative z-10 border-b border-primary pb-2 text-lg font-semibold text-[#364A63]">
                  General Price
                </p>
              </div>

              <div className="relative">
                <Input
                  placeholder="Search by Price Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                  className="h-10 w-[240px] rounded-lg border-[#D9D8DF] bg-[#F8F9FA] pr-10 text-sm placeholder:text-[#A1B1D1]"
                />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1B1D1]" />
              </div>
            </div>

            <Separator />

            {/* Price Group Cards in Grid */}
            <div className="custom-scroll-area my-10 grid max-h-[340px] grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 sm:gap-6">
              {isLoading ? (
                <div className="col-span-2 py-8 text-center">
                  <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-[#355FF5]" />
                  <div className="text-sm text-gray-500">Loading price groups...</div>
                </div>
              ) : error ? (
                <div className="col-span-2 py-8 text-center">
                  <div className="text-sm text-red-500">Error loading price groups</div>
                </div>
              ) : filteredPriceGroups.length === 0 ? (
                <div className="col-span-2 py-8 text-center">
                  <div className="text-sm text-gray-500">No price groups found</div>
                </div>
              ) : (
                <>
                  {/* Show info about filtered results if search is active */}
                  {searchTerm && (
                    <div className="col-span-2 mb-2 text-xs text-[#818894]">
                      Found {filteredPriceGroups.length}{' '}
                      {filteredPriceGroups.length === 1 ? 'result' : 'results'} for &quot;
                      {searchTerm}&quot;
                    </div>
                  )}
                  {filteredPriceGroups.map((group) => (
                    <div
                      key={group.id}
                      className={`relative min-h-[120px] cursor-pointer rounded-[5px] border p-3 transition-colors sm:min-h-[160px] sm:p-4 ${
                        selectedPriceGroup?.id === group.id
                          ? 'border-[#2ACF35] bg-white'
                          : 'border-[#808080] bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedPriceGroup(group)}
                    >
                      {selectedPriceGroup?.id === group.id && (
                        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#2ACF35] sm:right-5 sm:top-5">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}

                      <div className="flex items-start gap-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                          <LocationPinIcon width={27} height={32} />
                        </div>

                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-[#364A63]">{group.name}</h4>
                          <p
                            className={`text-xs text-[#818894] ${
                              getAppliedStationsCount(group) > 0 ? 'mb-4' : ''
                            }`}
                          >
                            {formatPriceDisplay(group)}
                          </p>

                          {getAppliedStationsCount(group) > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#355FF5]">
                                <span className="text-xs font-normal text-white">
                                  {getAppliedStationsCount(group)}
                                </span>
                              </div>
                              <span className="text-xs text-[#818894]">
                                Applied to {getAppliedStationsCount(group)} Stations
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Footer with Create new price group link and Action Buttons */}
          <DialogFooter className="flex-col items-center gap-4 border-t px-6 pb-6 pt-4">
            <Button variant="link" className="h-auto p-0 text-sm font-medium text-[#4E4E4E]">
              Create new price group
            </Button>
            <div className="flex w-full justify-end gap-3">
              <Button
                variant="outline"
                className="h-11 border-0 bg-[#F4F7FE] px-6 text-[#FF0000] hover:bg-[#F4F7FE]/80"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                className="h-11 bg-[#355FF5] px-6 hover:bg-[#355FF5]/90"
                onClick={handleContinue}
                disabled={!selectedPriceGroup || isLoading || isApplying}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Applying...
                  </>
                ) : selectedConnectors.length > 0 ? (
                  'Apply Price'
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SelectConnectorDialog
        open={showConnectorDialog}
        onOpenChange={setShowConnectorDialog}
        onConfirm={handleConnectorConfirm}
        onBack={handleConnectorDialogBack}
        selectedPriceGroup={selectedPriceGroup}
      />

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        title="Success"
        message="OCPP Integration has connected
completely"
        buttonText="Done"
        onButtonClick={handleSuccessDialogClose}
      />
    </>
  )
}
