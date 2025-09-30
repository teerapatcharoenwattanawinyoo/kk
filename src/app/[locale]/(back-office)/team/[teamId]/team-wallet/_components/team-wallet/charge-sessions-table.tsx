'use client'

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'

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

import { Pencil } from 'lucide-react'
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
        <span className="text-oc-sidebar text-xs font-medium">{row.original.orderNumber}</span>
        <span className="text-xs text-muted-foreground">{row.original.location}</span>
      </div>
    ),
  },
  {
    accessorKey: 'station',
    header: 'CHARGING STATION',
    meta: { className: 'w-[12%]' },
    cell: ({ getValue }) => <span className="text-oc-sidebar text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'charger',
    header: 'CHARGER',
    meta: { className: 'w-[10%]' },
    cell: ({ getValue }) => <span className="text-oc-sidebar text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'rate',
    header: 'RATE',
    meta: { className: 'w-[8%]' },
    cell: ({ getValue }) => <span className="text-oc-sidebar text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'startCharge',
    header: 'START CHARGE',
    meta: { className: 'w-[12%]' },
    cell: ({ getValue }) => <span className="text-oc-sidebar text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'stopCharge',
    header: 'STOP CHARGE',
    meta: { className: 'w-[12%]' },
    cell: ({ getValue }) => <span className="text-oc-sidebar text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'time',
    header: 'TIME',
    meta: { className: 'w-[8%]' },
    cell: ({ getValue }) => <span className="text-oc-sidebar text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'kWh',
    header: 'KWH',
    meta: { className: 'w-[6%]' },
    cell: ({ getValue }) => <span className="text-oc-sidebar text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'revenue',
    header: 'REVENUE',
    meta: { className: 'w-[10%]' },
    cell: ({ getValue }) => <span className="text-oc-sidebar text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    meta: { className: 'w-[10%]' },
    cell: ({ getValue }) => (
      <span className="bg-success-soft inline-flex rounded-md px-2 py-1 text-xs leading-5 text-[#07c59f]">
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
      <Button variant="ghost" size="icon" className="p-0">
        <Pencil className="h-3.5 w-3.5" />
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
                      'bg-primary px-4 py-3 text-center text-[10px] font-semibold uppercase text-primary-foreground',
                      (header.column.columnDef as ChargeSessionsColumn).meta?.className,
                    )}
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
                <TableRow
                  className="even:bg-muted/50"
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
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

      <div className="flex flex-col gap-3 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            className="h-8 w-[72px] rounded border border-input bg-background px-2 text-sm"
          >
            {[1, 5, 10, 20, 30, 40].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end space-x-6 sm:space-x-8">
          <div className="text-sm font-medium text-muted-foreground">
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
