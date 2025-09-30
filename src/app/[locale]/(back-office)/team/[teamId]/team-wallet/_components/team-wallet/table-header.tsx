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
}

export function TableHeader({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search by ID Announcement',
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
        <Select>
          <SelectTrigger className="h-10 w-[180px] bg-[#ECF2F8] text-xs sm:text-sm">
            <SelectValue className="text-[#A1B1D1]" placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
