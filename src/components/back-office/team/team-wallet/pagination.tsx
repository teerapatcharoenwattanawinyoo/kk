'use client'

import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage?: number
  totalResults?: number
  resultsPerPage?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function Pagination({
  currentPage = 1,
  totalResults = 130,
  resultsPerPage = 10,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startResult = (currentPage - 1) * resultsPerPage + 1
  const endResult = Math.min(currentPage * resultsPerPage, totalResults)

  return (
    <div className="my-4 border-gray-200 bg-card px-4 py-4 md:px-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            Showing {startResult} to {endResult} of {totalResults} Results
          </div>
          <div className="flex items-center">
            <select
              className="h-8 rounded-md border bg-background px-2 py-1 text-sm md:h-9 md:px-3"
              defaultValue={resultsPerPage.toString()}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            >
              <option value="10">10 List</option>
              <option value="20">20 List</option>
              <option value="50">50 List</option>
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:h-9 md:w-9"
            disabled={currentPage === 1}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
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
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 font-medium text-primary md:h-9 md:w-9">
            {currentPage}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:h-9 md:w-9"
            onClick={() => onPageChange?.(currentPage + 1)}
          >
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
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
