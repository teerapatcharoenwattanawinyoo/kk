'use client'

import { Separator } from '@/components/ui/separator'
import { ChargeSession } from '@/types'
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
}

export function TeamWalletTab({
  teamId,
  walletBalance,
  chargeSessions,
  searchQuery,
  onSearchChange,
}: TeamWalletTabProps) {
  return (
    <>
      <div className="mt-4 flex items-stretch gap-4">
        <WalletCard walletBalance={walletBalance} teamId={teamId} />
        <TopUpCard />
      </div>

      <div className="mt-6">
        <h2 className="text-title mb-3 text-lg font-semibold">Charge sessions from Team Wallet</h2>
        <Separator />

        <TableHeader
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          searchPlaceholder="Search by ID Announcement"
        />

        <ChargeSessionsTable sessions={chargeSessions} />
      </div>
    </>
  )
}
