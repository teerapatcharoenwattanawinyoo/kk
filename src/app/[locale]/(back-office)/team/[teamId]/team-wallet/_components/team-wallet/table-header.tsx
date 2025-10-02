'use client'

import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui'

import { Search } from 'lucide-react'

interface TableHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  statusFilter: string
  onStatusChange: (value: string) => void
  statuses: string[]
}

const TableHeader = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search by ID Announcement',
  statusFilter,
  onStatusChange,
  statuses,
}: TableHeaderProps) => {
  return (
    <div className="mt-4 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap md:flex-nowrap">
        <div className="relative w-full sm:max-w-[420px] md:max-w-[520px] lg:max-w-[600px]">
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full bg-background pl-4 pr-10 text-sm placeholder:font-medium placeholder:text-muted-foreground sm:text-base"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <Search className="size-4 text-muted-foreground" />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="h-10 w-full justify-between bg-background text-left text-xs text-muted-foreground sm:max-w-[260px] sm:text-sm md:w-[260px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent className="text-xs sm:text-sm">
            <SelectItem value="all">All</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export { TableHeader }
