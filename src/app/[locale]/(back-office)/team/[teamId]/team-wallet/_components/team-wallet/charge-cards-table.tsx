'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
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

interface ChargeCardsTableProps {
  cards: ChargeCard[]
}

const centeredColumnIds = new Set(['owner', 'accessibility', 'status', 'created', 'actions'])

export function ChargeCardsTable({ cards }: ChargeCardsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  const columns = React.useMemo<ColumnDef<ChargeCardRow>[]>(
    () => [
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
        size: 48,
      },
      {
        accessorKey: 'cardId',
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {cards.length} Charge Cards
          </span>
        ),
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
        filterFn: (row, columnId, value) => {
          const search = String(value).toLowerCase().trim()
          if (!search) {
            return true
          }

          const card = row.original
          return (
            card.cardId.toLowerCase().includes(search) ||
            card.id.toLowerCase().includes(search) ||
            card.owner.toLowerCase().includes(search)
          )
        },
      },
      {
        accessorKey: 'owner',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="mx-auto -ml-2 h-8 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Owner
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-3.5 w-3.5" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-3.5 w-3.5" />
            ) : (
              <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
            )}
          </Button>
        ),
        cell: ({ row }) => <span className="text-sm text-[#6E82A5]">{row.getValue('owner')}</span>,
      },
      {
        accessorKey: 'accessibility',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="mx-auto -ml-2 h-8 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Accessibility
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-3.5 w-3.5" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-3.5 w-3.5" />
            ) : (
              <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm text-[#6E82A5]">{row.getValue('accessibility')}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="mx-auto -ml-2 h-8 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-3.5 w-3.5" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-3.5 w-3.5" />
            ) : (
              <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const status = row.getValue('status') as string
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
      },
      {
        accessorKey: 'created',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="mx-auto -ml-2 h-8 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-3.5 w-3.5" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-3.5 w-3.5" />
            ) : (
              <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <span className="whitespace-pre-line text-sm text-[#6E82A5]">
            {row.getValue('created') as string}
          </span>
        ),
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
      },
    ],
    [cards.length]
  )

  const table = useReactTable({
    data: cards,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const filterValue = (table.getColumn('cardId')?.getFilterValue() as string) ?? ''

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search cards..."
          value={filterValue}
          onChange={(event) =>
            table.getColumn('cardId')?.setFilterValue(event.target.value)
          }
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
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      centeredColumnIds.has(header.column.id)
                        ? 'text-center'
                        : 'text-left',
                      header.column.id === 'select' && 'w-12'
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        centeredColumnIds.has(cell.column.id)
                          ? 'text-center'
                          : 'text-left'
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
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
