'use client'

import { ConnectorIcon } from '@/components/icons/ConnectorIcon'
import { Separator } from '@/components/ui/separator'

type MinimalConnector = {
  id: number
  name?: string | null
  station_name?: string | null
}

export interface SelectedConnectorsDisplayProps {
  selectedConnectors: MinimalConnector[]
  showSeparator?: boolean
}

export default function SelectedConnectorsDisplay({
  selectedConnectors,
  showSeparator = true,
}: SelectedConnectorsDisplayProps) {
  if (selectedConnectors.length === 0) {
    return null
  }

  return (
    <div className="px-6 pb-6">
      <div>
        <div className="max-h-[150px] space-y-2 overflow-y-auto">
          {selectedConnectors.map((connector) => (
            <div
              key={connector.id}
              className="flex items-center gap-3 rounded-lg p-3"
            >
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#E7E7E7] bg-card">
                <ConnectorIcon width={10} height={15} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#364A63]">
                  {connector.name}
                </p>
                <p className="text-xs text-[#818894]">
                  {connector.station_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showSeparator && <Separator className="mb-4" />}
    </div>
  )
}
