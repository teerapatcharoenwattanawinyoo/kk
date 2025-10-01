'use client'

import * as React from 'react'

import { Separator } from '@/components/ui/separator'

import { ChargeSession } from '../../_schemas/team-wallet.schema'
import { ChargeSessionsTable } from './charge-sessions-table'
import { TableHeader } from './table-header'
import { TopUpCard } from './top-up-card'
import { WalletCard } from './wallet-card'

interface TeamWalletTabProps {
  teamId: string
  walletBalance: number
  chargeSessions: ChargeSession[]
  searchQuery: string
  onSearchChange: (value: string) => void
  isWalletLoading?: boolean
}

const TeamWalletTab = ({
  teamId,
  walletBalance,
  chargeSessions,
  searchQuery,
  onSearchChange,
  isWalletLoading = false,
}: TeamWalletTabProps) => {
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  const statuses = React.useMemo(
    () => Array.from(new Set(chargeSessions.map((session) => session.status))).sort(),
    [chargeSessions],
  )

  return (
    <>
      <div className="mt-4 flex items-stretch gap-4">
        <WalletCard walletBalance={walletBalance} teamId={teamId} isLoading={isWalletLoading} />
        <TopUpCard />
      </div>

      <div className="mt-6">
        <h2 className="text-oc-title-secondary mb-3 text-lg font-semibold">
          Charge sessions from Team Wallet
        </h2>
        <Separator />

        <TableHeader
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          searchPlaceholder="Search by ID Announcement"
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          statuses={statuses}
        />

        <ChargeSessionsTable
          sessions={chargeSessions}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
        />
      </div>
    </>
  )
}

export { TeamWalletTab }
