'use client'

import { Button } from '@/components/ui/button'
import { DataTable, TableColumn } from '@/components/ui/data-table'

import { ChargeSession } from '../../_schemas/team-wallet.schema'

interface ChargeSessionsTableProps {
  sessions: ChargeSession[]
}

type ChargeSessionRow = ChargeSession & Record<string, string>

const columns: TableColumn<ChargeSessionRow>[] = [
  {
    key: 'orderNumber',
    header: 'ORDER NUMBER',
    align: 'center',
    width: '16%',
    render: (_, row) => (
      <div className="flex flex-col items-center">
        <span className="text-xs font-medium text-oc-sidebar">{row.orderNumber}</span>
        <span className="text-xs text-muted-foreground">{row.location}</span>
      </div>
    ),
  },
  {
    key: 'station',
    header: 'CHARGING STATION',
    align: 'center',
    width: '12%',
    render: (value) => <span className="text-xs text-oc-sidebar">{value}</span>,
  },
  {
    key: 'charger',
    header: 'CHARGER',
    align: 'center',
    width: '10%',
    render: (value) => <span className="text-xs text-oc-sidebar">{value}</span>,
  },
  {
    key: 'rate',
    header: 'RATE',
    align: 'center',
    width: '8%',
    render: (value) => <span className="text-xs text-oc-sidebar">{value}</span>,
  },
  {
    key: 'startCharge',
    header: 'START CHARGE',
    align: 'center',
    width: '12%',
    render: (value) => <span className="text-xs text-oc-sidebar">{value}</span>,
  },
  {
    key: 'stopCharge',
    header: 'STOP CHARGE',
    align: 'center',
    width: '12%',
    render: (value) => <span className="text-xs text-oc-sidebar">{value}</span>,
  },
  {
    key: 'time',
    header: 'TIME',
    align: 'center',
    width: '8%',
    render: (value) => <span className="text-xs text-oc-sidebar">{value}</span>,
  },
  {
    key: 'kWh',
    header: 'KWH',
    align: 'center',
    width: '6%',
    render: (value) => <span className="text-xs text-oc-sidebar">{value}</span>,
  },
  {
    key: 'revenue',
    header: 'REVENUE',
    align: 'center',
    width: '10%',
    render: (value) => <span className="text-xs text-oc-sidebar">{value}</span>,
  },
  {
    key: 'status',
    header: 'STATUS',
    align: 'center',
    width: '10%',
    render: (value) => (
      <span className="inline-flex rounded-md bg-[#DFF8F3] px-2 py-1 text-xs font-semibold leading-5 text-[#0D8A72]">
        {value}
      </span>
    ),
  },
  {
    key: 'action',
    header: 'ACTION',
    align: 'center',
    width: '8%',
    render: () => (
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
        <svg width="10" height="10" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.38318 0C9.80871 0 10.2166 0.169903 10.5145 0.47017L12.5299 2.48552C12.8299 2.78558 12.9985 3.19254 12.9985 3.61688C12.9985 4.04122 12.83 4.44819 12.5299 4.74824L5.17178 12.104C4.71782 12.6277 4.07431 12.9494 3.3371 13H0V12.3501L0.00211073 9.61063C0.0574781 8.9253 0.37609 8.28805 0.862122 7.85981L8.25104 0.470954C8.55066 0.169519 8.95813 0 9.38318 0ZM3.29214 11.6988C3.63934 11.6742 3.96254 11.5126 4.22206 11.2158L9.13528 6.30255L6.69522 3.8624L1.75328 8.80323C1.48988 9.03612 1.32698 9.36194 1.30078 9.65999V11.6976L3.29214 11.6988ZM7.61446 2.94338L10.0544 5.38342L11.6117 3.82613C11.668 3.76985 11.6996 3.69351 11.6996 3.61391C11.6996 3.53431 11.668 3.45797 11.6117 3.40168L9.59455 1.38452C9.53889 1.32843 9.46314 1.29688 9.38412 1.29688C9.3051 1.29688 9.22935 1.32843 9.17369 1.38452L7.61446 2.94338Z"
            fill="#818894"
          />
        </svg>
      </Button>
    ),
  },
]

export function ChargeSessionsTable({ sessions }: ChargeSessionsTableProps) {
  const tableData = sessions.map((session) => ({ ...session })) as ChargeSessionRow[]

  return (
    <div className="mt-4">
      <DataTable data={tableData} columns={columns} className="border-0 shadow-none" />
    </div>
  )
}
