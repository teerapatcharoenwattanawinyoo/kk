'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable, type TableColumn } from '@/components/ui/data-table'
import { CreditCard, MoreHorizontal } from 'lucide-react'

import { type ChargeCard } from '../../_schemas/team-wallet.schema'

interface ChargeCardsTableProps {
  cards: ChargeCard[]
}

export function ChargeCardsTable({ cards }: ChargeCardsTableProps) {
  type ChargeCardRow = ChargeCard & { action?: string }

  const columns: TableColumn<ChargeCardRow>[] = [
    {
      key: 'id',
      header: `${cards.length} CHARGE CARDS`,
      align: 'center',
      render: (_value, card) => (
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#E7E7E7] bg-card text-[#B6B6B6]">
            <CreditCard className="h-4 w-4" />
            <div className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-[#6E82A5]">CARD {card.id}</div>
            <div className="text-xs text-[#818894]">ID: {card.cardId}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'owner',
      header: 'OWNER',
      align: 'center',
      render: (value) => <span className="text-sm text-[#6E82A5]">{value}</span>,
    },
    {
      key: 'accessibility',
      header: 'ACCESSIBILITY',
      align: 'center',
      render: (value) => <span className="text-sm text-[#6E82A5]">{value}</span>,
    },
    {
      key: 'status',
      header: 'STATUS',
      align: 'center',
      render: (value) => (
        <Badge
          className={
            value === 'Active'
              ? 'rounded-lg bg-[#DFF8F3] px-4 py-1 text-[#0D8A72] hover:bg-[#DFF8F3] hover:text-[#0D8A72]'
              : 'rounded-lg bg-[#D1E9FF] px-4 py-1 text-[#40A3FF] hover:bg-[#D1E9FF] hover:text-[#40A3FF]'
          }
        >
          <p className="text-xs font-medium">{value}</p>
        </Badge>
      ),
    },
    {
      key: 'created',
      header: 'CREATED',
      align: 'center',
      render: (value) => <span className="whitespace-pre-line text-sm text-[#6E82A5]">{value}</span>,
    },
    {
      key: 'action',
      header: 'ACTION',
      align: 'center',
      render: () => (
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ]

  const tableData: ChargeCardRow[] = cards.map((card) => ({ ...card, action: '' }))

  return (
    <div className="mt-2">
      <DataTable columns={columns} data={tableData} className="border-0" />
    </div>
  )
}
