'use client'
import { getConnectorList } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_servers/connectors'
import type { ConnectorSelectItem } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_servers/connectors'
import { useTeam } from '@/app/[locale]/(back-office)/team/_hooks/use-teams'
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { QUERY_KEYS } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Search } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SelectConnectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: (selectedConnectors: ConnectorSelectItem[]) => void
  onBack?: () => void
  selectedPriceGroup?: { id: number; name: string } | null
  connectorInfo?: { name: string; serial_number: string } | null
}

export default function SelectConnectorDialog({
  open,
  onOpenChange,
  onConfirm,
  onBack,
  selectedPriceGroup,
}: SelectConnectorDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [selectedConnectors, setSelectedConnectors] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [previousParentId, setPreviousParentId] = useState<number | null>(null)

  const params = useParams()
  const teamId = params.id as string
  const { data: teamData } = useTeam(teamId)
  const teamGroupId = teamData?.team_group_id

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Track parent_id changes
  useEffect(() => {
    const currentParentId = selectedPriceGroup?.id || null

    if (previousParentId !== null && currentParentId !== previousParentId) {
      // Reset connector selection when parent_id changes
      if (selectedConnectors.length > 0) {
        setSelectedConnectors([])
        setSelectAll(false)
      }
    }

    setPreviousParentId(currentParentId)
  }, [
    selectedPriceGroup?.id,
    selectedPriceGroup,
    previousParentId,
    selectedConnectors.length,
  ])

  const {
    data: connectorResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...QUERY_KEYS.CONNECTOR, teamGroupId, debouncedSearchTerm],
    queryFn: () => {
      if (!teamGroupId) {
        throw new Error('Team group ID is required')
      }
      return getConnectorList(teamGroupId, debouncedSearchTerm || undefined)
    },
    enabled: !!teamGroupId && open,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  // Get connector data from API
  const connectors = connectorResponse?.data?.data || []

  const filteredConnectors = connectors

  useEffect(() => {
    if (!open) {
      setSearchTerm('')
      setSelectedConnectors([])
      setSelectAll(false)
    }
  }, [open])
  useEffect(() => {
    if (selectAll) {
      setSelectedConnectors(filteredConnectors.map((c) => c.id))
    } else if (
      selectedConnectors.length === filteredConnectors.length &&
      filteredConnectors.length > 0
    ) {
      // Only clear if we're explicitly deselecting all, not on initial load
      if (filteredConnectors.length > 0) {
        setSelectedConnectors([])
      }
    }
  }, [selectAll, filteredConnectors, selectedConnectors.length])

  // Update select all state based on individual selections
  useEffect(() => {
    if (filteredConnectors.length > 0) {
      const allSelected = filteredConnectors.every((c) =>
        selectedConnectors.includes(c.id),
      )
      setSelectAll(allSelected)
    }
  }, [selectedConnectors, filteredConnectors, selectedConnectors.length])

  const handleConnectorToggle = (connectorId: number) => {
    setSelectedConnectors((prev) => {
      if (prev.includes(connectorId)) {
        return prev.filter((id) => id !== connectorId)
      } else {
        return [...prev, connectorId]
      }
    })
  }

  const handleSelectAllToggle = () => {
    setSelectAll(!selectAll)
  }

  const handleApplyPrice = () => {
    if (onConfirm) {
      const selected = connectors.filter((c) =>
        selectedConnectors.includes(c.id),
      )

      onConfirm(selected)
    }
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[600px] max-w-[650px] gap-0 overflow-hidden rounded-[20px] bg-card p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E0E0E0] px-6 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleBack}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl font-semibold text-[#355FF5]">
              Select Connector
            </DialogTitle>
          </div>
        </div>

        {/* Search Section */}
        <div className="px-6 py-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1B1D1]" />
            <Input
              placeholder="Search by ID Connector"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
              className="h-9 w-[225px] rounded border-[#D9D8DF] bg-[#ECF2F8] pl-10 pr-4 text-sm placeholder:text-[#A1B1D1]"
            />
          </div>
        </div>
        <div className="px-6">
          <Separator className="mb-2" />
        </div>
        {/* Select All Section */}
        <div className="px-6 pb-3">
          <div className="flex w-fit items-center gap-3 rounded-lg bg-[#F4F4F4] px-3 py-2">
            <Checkbox
              id="select-all"
              checked={selectAll}
              onCheckedChange={handleSelectAllToggle}
              className="h-[15px] w-[15px] rounded-sm border-[#D5D5D5] data-[state=checked]:border-[#009032] data-[state=checked]:bg-[#3ABA66]"
            />
            <label
              htmlFor="select-all"
              className="cursor-pointer text-xs font-semibold text-[#9C9C9C]"
            >
              Select All
            </label>
          </div>
        </div>

        {/* Connectors List */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <div className="space-y-1">
            {isLoading ? (
              <div className="py-8 text-center">
                <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-[#355FF5]" />
                <div className="text-sm text-gray-500">
                  Loading connectors...
                </div>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <div className="text-sm text-red-500">
                  Error loading connectors
                </div>
              </div>
            ) : filteredConnectors.length === 0 ? (
              <div className="py-8 text-center">
                <div className="text-sm text-gray-500">No connectors found</div>
              </div>
            ) : (
              filteredConnectors.map((connector) => {
                const isSelected = selectedConnectors.includes(connector.id)

                return (
                  <div
                    key={connector.id}
                    className="flex h-12 cursor-pointer items-center gap-3 rounded bg-card px-3 hover:bg-[#EFF2FC]"
                    onClick={() => handleConnectorToggle(connector.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() =>
                        handleConnectorToggle(connector.id)
                      }
                      className="h-[15px] w-[15px] rounded-sm border-[#D5D5D5] data-[state=checked]:border-[#009032] data-[state=checked]:bg-[#3ABA66]"
                    />

                    <div className="flex flex-1 items-center gap-2">
                      {/* Connector Icon */}
                      <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[#E7E7E7] bg-card">
                        <svg
                          width="10"
                          height="14"
                          viewBox="0 0 12 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.918 6.06488C11.8556 5.93328 11.7602 5.82261 11.6422 5.74514C11.5243 5.66767 11.3885 5.62643 11.2499 5.62598H7.49686V0.837975C7.50492 0.66296 7.45856 0.489991 7.36496 0.345768C7.27135 0.201544 7.1357 0.0940836 6.97894 0.0399734C6.82823 -0.01274 6.6657 -0.0133324 6.51466 0.0382813C6.36362 0.089895 6.23184 0.19106 6.13825 0.327254L0.13335 9.10527C0.0581126 9.22087 0.0129354 9.35555 0.00239073 9.49568C-0.00815397 9.63581 0.0163081 9.77642 0.0733008 9.90327C0.125785 10.0483 0.216959 10.1739 0.335632 10.2646C0.454305 10.3553 0.595313 10.4073 0.741346 10.414H4.49441V15.202C4.49453 15.3703 4.54468 15.5342 4.6377 15.6704C4.73072 15.8065 4.86184 15.9079 5.01233 15.9601C5.08775 15.985 5.16608 15.9984 5.24502 16C5.36346 16.0003 5.48029 15.9709 5.58596 15.914C5.69163 15.8571 5.78314 15.7745 5.85302 15.6728L11.8579 6.8948C11.9388 6.77574 11.9872 6.63526 11.9978 6.48883C12.0084 6.3424 11.9808 6.1957 11.918 6.06488ZM5.99564 12.7442V9.61599C5.99564 9.40434 5.91655 9.20137 5.77579 9.05172C5.63502 8.90206 5.4441 8.81799 5.24502 8.81799H2.24257L5.99564 3.29582V6.42398C5.99564 6.63563 6.07472 6.8386 6.21549 6.98826C6.35625 7.13791 6.54717 7.22198 6.74625 7.22198H9.7487L5.99564 12.7442Z"
                            fill="#798BFF"
                          />
                        </svg>
                      </div>
                      {/* Connector Info */}
                      <p className="text-sm font-normal">
                        {connector.name} , {connector.station_name}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <DialogFooter className="flex-row justify-end gap-3 px-6 py-4">
          <Button
            variant="outline"
            className="h-11 border-0 bg-[#F4F7FE] px-6 text-[#FF0000] hover:bg-[#F4F7FE]/80"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className="h-11 bg-[#355FF5] px-6 hover:bg-[#355FF5]/90"
            onClick={handleApplyPrice}
            disabled={selectedConnectors.length === 0 || isLoading}
          >
            Apply Price
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
