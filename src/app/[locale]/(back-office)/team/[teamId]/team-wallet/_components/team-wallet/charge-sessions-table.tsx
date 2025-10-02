'use client'

import { cn } from '@/lib/utils'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type HeaderContext,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Pencil } from 'lucide-react'
import * as React from 'react'
import { WalletTransactionItem } from '../../_schemas/team-wallet-transactions.schema'

interface ChargeSessionsTableProps {
  sessions: WalletTransactionItem[]
  searchQuery: string
  statusFilter: string
}

type ChargeSessionsColumn = ColumnDef<WalletTransactionItem> & {
  meta?: {
    className?: string
  }
}

const searchableFields: (keyof WalletTransactionItem)[] = [
  'order_number',
  'charging_station',
  'charger_id',
  'rate',
  'start_time',
  'end_time',
  'charging_time',
  'status',
]

const createSortableHeader =
  (title: string) =>
  ({ column }: HeaderContext<WalletTransactionItem, unknown>) => {
    const sorted = column.getIsSorted()

    const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown

    return (
      <button
        type="button"
        onClick={() => column.toggleSorting(sorted === 'asc')}
        className="flex w-full items-center justify-center gap-1 text-xs font-semibold uppercase text-current"
      >
        <span>{title}</span>
        <Icon className="size-3 text-current" />
      </button>
    )
  }

const statusFilterFn: FilterFn<WalletTransactionItem> = (row, columnId, filterValue) => {
  const status = String(row.getValue<string>(columnId)).toLowerCase()
  const filter = String(filterValue).toLowerCase()

  return status === filter
}

const globalFilterFn: FilterFn<WalletTransactionItem> = (row, _columnId, filterValue) => {
  const search = String(filterValue).trim().toLowerCase()

  if (!search) {
    return true
  }

  return searchableFields.some((field) => {
    const value = row.original[field]
    return String(value).toLowerCase().includes(search)
  })
}

const columns: ChargeSessionsColumn[] = [
  {
    accessorKey: 'order_number',
    header: createSortableHeader('ORDER NUMBER'),
    meta: { className: 'w-[16%]' },
    cell: ({ row }) => (
      <div className="flex flex-col items-center">
        <span className="text-oc-sidebar text-xs font-medium">{row.original.order_number}</span>
        <span className="text-xs text-muted-foreground">{row.original.charging_station}</span>
      </div>
    ),
  },
  {
    accessorKey: 'charging_station',
    header: createSortableHeader('CHARGING STATION'),
    meta: { className: 'w-[12%]' },
    cell: ({ getValue }) => <span className="text-oc-sidebar text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'charger_id',
    header: createSortableHeader('CHARGER'),
    meta: { className: 'w-[10%]' },
    cell: ({ getValue }) => <span className="text-oc-sidebar text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'rate',
    header: createSortableHeader('RATE'),
    meta: { className: 'w-[8%]' },
    cell: ({ getValue }) => (
      <span className="text-oc-sidebar text-xs">{getValue<string>()} ฿/kWh</span>
    ),
  },
  {
    accessorKey: 'start_time',
    header: createSortableHeader('START CHARGE'),
    meta: { className: 'w-[12%]' },
    cell: ({ getValue }) => {
      const date = new Date(getValue<string>())
      return <span className="text-oc-sidebar text-xs">{date.toLocaleString()}</span>
    },
  },
  {
    accessorKey: 'end_time',
    header: createSortableHeader('STOP CHARGE'),
    meta: { className: 'w-[12%]' },
    cell: ({ getValue }) => {
      const date = new Date(getValue<string>())
      return <span className="text-oc-sidebar text-xs">{date.toLocaleString()}</span>
    },
  },
  {
    accessorKey: 'charging_time',
    header: createSortableHeader('TIME'),
    meta: { className: 'w-[8%]' },
    cell: ({ getValue }) => <span className="text-oc-sidebar text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'kwh',
    header: createSortableHeader('KWH'),
    meta: { className: 'w-[6%]' },
    cell: ({ getValue }) => {
      const value = getValue<number>()
      const numValue = typeof value === 'number' ? value : Number(value) || 0
      return <span className="text-oc-sidebar text-xs">{numValue.toFixed(2)}</span>
    },
  },
  {
    accessorKey: 'revenue',
    header: createSortableHeader('REVENUE'),
    meta: { className: 'w-[10%]' },
    cell: ({ getValue }) => {
      const value = getValue<number>()
      const numValue = typeof value === 'number' ? value : Number(value) || 0
      return <span className="text-oc-sidebar text-xs">฿{numValue.toFixed(2)}</span>
    },
  },
  {
    accessorKey: 'status',
    header: createSortableHeader('STATUS'),
    filterFn: statusFilterFn,
    meta: { className: 'w-auto' },
    cell: ({ getValue }) => {
      const status = getValue<string>()
      if (status?.toLowerCase() === 'failed') {
        return (
          <span className="inline-flex rounded-md bg-destructive/10 px-2 py-1 text-xs font-semibold leading-5 text-destructive">
            {status}
          </span>
        )
      } else if (status?.toLowerCase() === 'completed') {
      }
      return (
        <span className="bg-success-soft inline-flex rounded-md px-2 py-1 text-xs font-semibold leading-5 text-[#22ba7d]">
          {status}
        </span>
      )
    },
  },
  {
    id: 'action',
    header: 'ACTION',
    enableSorting: false,
    enableHiding: false,
    meta: { className: 'w-[8%]' },
    cell: () => (
      <Button variant="ghost" size="icon" className="p-0">
        <Pencil className="size-4 text-muted-foreground" />
      </Button>
    ),
  },
]

const ChargeSessionsTable = ({ sessions, searchQuery, statusFilter }: ChargeSessionsTableProps) => {
  const data = React.useMemo(() => sessions, [sessions])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: searchQuery,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  React.useEffect(() => {
    setColumnFilters((currentFilters) => {
      const withoutStatus = currentFilters.filter((filter) => filter.id !== 'status')

      if (!statusFilter || statusFilter === 'all') {
        return withoutStatus
      }

      return [...withoutStatus, { id: 'status', value: statusFilter }]
    })
  }, [statusFilter])

  const pageCount = table.getPageCount()

  return (
    <div className="mt-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'bg-primary px-4 py-3 text-center text-xs font-semibold uppercase text-primary-foreground',
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="even:bg-muted/60"
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
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
            {[5, 10, 20, 30, 40].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <div className="text-sm font-medium text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(pageCount, 1)}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-6 sm:space-x-8">
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
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
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

export { ChargeSessionsTable }
