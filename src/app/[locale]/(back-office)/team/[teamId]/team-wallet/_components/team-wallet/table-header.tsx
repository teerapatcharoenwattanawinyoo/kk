'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

interface TableHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  statusFilter: string
  onStatusChange: (value: string) => void
  statuses: string[]
}

export function TableHeader({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search by ID Announcement',
  statusFilter,
  onStatusChange,
  statuses,
}: TableHeaderProps) {
  return (
    <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row">
      <div className="flex flex-1 gap-3">
        <div className="relative max-w-md">
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 bg-[#ECF2F8] pl-4 pr-10 placeholder:font-medium placeholder:text-[#A1B1D1]"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <Search className="h-4 w-4 text-[#A1B1D1]" />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="h-10 w-full max-w-[200px] justify-between bg-[#ECF2F8] text-left text-xs text-[#A1B1D1] sm:text-sm">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent className="text-xs sm:text-sm">
            <SelectItem value="all">All statuses</SelectItem>
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
