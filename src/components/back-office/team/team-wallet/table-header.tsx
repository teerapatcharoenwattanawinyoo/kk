'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
            <svg
              className="h-4 w-4 text-[#A1B1D1]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-1 whitespace-nowrap bg-[#ECF2F8] text-xs sm:text-sm"
        >
          <span className="text-[#A1B1D1]">Filter by Status</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-[#A1B1D1]"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
