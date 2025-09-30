'use client'

import * as React from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

import { ChargeSession } from '../../_schemas/team-wallet.schema'

interface ChargeSessionsTableProps {
  sessions: ChargeSession[]
}

type ChargeSessionsColumn = ColumnDef<ChargeSession> & {
  meta?: {
    className?: string
  }
}

const columns: ChargeSessionsColumn[] = [
  {
    accessorKey: 'orderNumber',
    header: 'ORDER NUMBER',
    meta: { className: 'w-[16%]' },
    cell: ({ row }) => (
      <div className="flex flex-col items-center">
        <span className="text-xs font-medium text-oc-sidebar">{row.original.orderNumber}</span>
        <span className="text-xs text-muted-foreground">{row.original.location}</span>
      </div>
    ),
  },
  {
    accessorKey: 'station',
    header: 'CHARGING STATION',
    meta: { className: 'w-[12%]' },
    cell: ({ getValue }) => <span className="text-xs text-oc-sidebar">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'charger',
    header: 'CHARGER',
    meta: { className: 'w-[10%]' },
    cell: ({ getValue }) => <span className="text-xs text-oc-sidebar">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'rate',
    header: 'RATE',
    meta: { className: 'w-[8%]' },
    cell: ({ getValue }) => <span className="text-xs text-oc-sidebar">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'startCharge',
    header: 'START CHARGE',
    meta: { className: 'w-[12%]' },
    cell: ({ getValue }) => <span className="text-xs text-oc-sidebar">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'stopCharge',
    header: 'STOP CHARGE',
    meta: { className: 'w-[12%]' },
    cell: ({ getValue }) => <span className="text-xs text-oc-sidebar">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'time',
    header: 'TIME',
    meta: { className: 'w-[8%]' },
    cell: ({ getValue }) => <span className="text-xs text-oc-sidebar">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'kWh',
    header: 'KWH',
    meta: { className: 'w-[6%]' },
    cell: ({ getValue }) => <span className="text-xs text-oc-sidebar">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'revenue',
    header: 'REVENUE',
    meta: { className: 'w-[10%]' },
    cell: ({ getValue }) => <span className="text-xs text-oc-sidebar">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    meta: { className: 'w-[10%]' },
    cell: ({ getValue }) => (
      <span className="inline-flex rounded-md bg-[#DFF8F3] px-2 py-1 text-xs font-semibold leading-5 text-[#0D8A72]">
        {getValue<string>()}
      </span>
    ),
  },
  {
    id: 'action',
    header: 'ACTION',
    enableSorting: false,
    enableHiding: false,
    meta: { className: 'w-[8%]' },
    cell: () => (
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
  const data = React.useMemo(() => sessions, [sessions])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  const pageCount = table.getPageCount()

  return (
    <div className="mt-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'bg-[#F7FAFC] px-4 py-3 text-[10px] font-semibold uppercase text-[#6A7995] text-center',
                      (header.column.columnDef as ChargeSessionsColumn).meta?.className)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'px-4 py-3 text-center align-middle',
                        (cell.column.columnDef as ChargeSessionsColumn).meta?.className,
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 py-4 text-xs text-[#475467] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            className="h-8 w-[72px] rounded border border-input bg-background px-2 text-sm"
          >
            {[5, 10, 20, 30, 40].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end space-x-6 sm:space-x-8">
          <div className="text-sm font-medium text-[#6A7995]">
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(pageCount, 1)}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(Math.max(pageCount - 1, 0))}
              disabled={!table.getCanNextPage()}
            >
              Last
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
