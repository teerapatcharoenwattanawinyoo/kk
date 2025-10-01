'use client'

import * as React from 'react'
import {
  type ColumnDef,
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowDown, ArrowUp, ArrowUpDown, CreditCard, MoreHorizontal, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type ChargeCard } from '../../_schemas/team-wallet.schema'

type ChargeCardRow = ChargeCard

type ChargeCardsColumn = ColumnDef<ChargeCardRow> & {
  meta?: {
    className?: string
  }
}

const searchableFields: (keyof ChargeCardRow)[] = [
  'cardId',
  'id',
  'owner',
  'accessibility',
  'status',
  'created',
]

const createSortableHeader =
  (title: string, alignment: 'left' | 'center' = 'left') =>
  ({ column }: HeaderContext<ChargeCardRow, unknown>) => {
    const sorted = column.getIsSorted()
    const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown

    return (
      <button
        type="button"
        onClick={() => column.toggleSorting(sorted === 'asc')}
        className={cn(
          'flex w-full items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground',
          alignment === 'center' ? 'justify-center' : 'justify-start'
        )}
      >
        <span>{title}</span>
        <Icon className="h-3.5 w-3.5" />
      </button>
    )
  }

const globalFilterFn: FilterFn<ChargeCardRow> = (row, _columnId, value) => {
  const search = String(value).trim().toLowerCase()

  if (!search) {
    return true
  }

  return searchableFields.some((field) =>
    row.original[field].toLowerCase().includes(search)
  )
}

const columns: ChargeCardsColumn[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { className: 'w-[48px] text-center' },
  },
  {
    accessorKey: 'cardId',
    header: ({ table }) => {
      const totalCards = table.getPreFilteredRowModel().rows.length

      return (
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {totalCards} Charge Cards
        </span>
      )
    },
    enableSorting: false,
    cell: ({ row }) => {
      const card = row.original

      return (
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <div className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </div>
          <div>
            <div className="text-sm font-medium uppercase tracking-wide text-[#6E82A5]">
              Card {card.id}
            </div>
            <div className="text-xs text-[#818894]">ID: {card.cardId}</div>
          </div>
        </div>
      )
    },
    meta: { className: 'px-4 text-left' },
  },
  {
    accessorKey: 'owner',
    header: createSortableHeader('Owner', 'center'),
    cell: ({ getValue }) => (
      <span className="text-sm text-[#6E82A5]">{getValue<string>()}</span>
    ),
    meta: { className: 'px-4 text-center' },
  },
  {
    accessorKey: 'accessibility',
    header: createSortableHeader('Accessibility', 'center'),
    cell: ({ getValue }) => (
      <span className="text-sm text-[#6E82A5]">{getValue<string>()}</span>
    ),
    meta: { className: 'px-4 text-center' },
  },
  {
    accessorKey: 'status',
    header: createSortableHeader('Status', 'center'),
    cell: ({ getValue }) => {
      const status = getValue<string>()
      const isActive = status === 'Active'

      return (
        <Badge
          className={cn(
            'rounded-lg px-4 py-1 text-xs font-medium',
            isActive
              ? 'bg-[#DFF8F3] text-[#0D8A72] hover:bg-[#DFF8F3] hover:text-[#0D8A72]'
              : 'bg-[#D1E9FF] text-[#40A3FF] hover:bg-[#D1E9FF] hover:text-[#40A3FF]'
          )}
        >
          {status}
        </Badge>
      )
    },
    meta: { className: 'px-4 text-center' },
  },
  {
    accessorKey: 'created',
    header: createSortableHeader('Created', 'center'),
    cell: ({ getValue }) => (
      <span className="whitespace-pre-line text-sm text-[#6E82A5]">
        {getValue<string>()}
      </span>
    ),
    meta: { className: 'px-4 text-center' },
  },
  {
    id: 'actions',
    enableSorting: false,
    enableHiding: false,
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Action
      </span>
    ),
    cell: ({ row }) => {
      const card = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard?.writeText(card.cardId)}
            >
              Copy card ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard?.writeText(card.owner)}
            >
              Copy owner name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View card details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    meta: { className: 'px-4 text-center' },
  },
]

interface ChargeCardsTableProps {
  cards: ChargeCard[]
}

export function ChargeCardsTable({ cards }: ChargeCardsTableProps) {
  const data = React.useMemo(() => cards, [cards])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search cards..."
          value={table.getState().globalFilter as string}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="w-full max-w-sm"
        />
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button className="h-10 text-xs sm:text-sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Card
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const column = header.column.columnDef as ChargeCardsColumn

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground',
                        column.meta?.className,
                        header.column.id === 'cardId' && 'text-left'
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
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => {
                    const column = cell.column.columnDef as ChargeCardsColumn

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn('px-4 py-3 align-middle', column.meta?.className)}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2 py-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center justify-end gap-2">
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
        </div>
      </div>
    </div>
  )
}
