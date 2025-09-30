'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChargeCard } from '@/types'
import { Plus } from 'lucide-react'
import { ChargeCardsTable } from './charge-cards-table'

interface ChargeCardsTabProps {
  chargeCards: ChargeCard[]
}

export function ChargeCardsTab({ chargeCards }: ChargeCardsTabProps) {
  return (
    <div className="mt-4">
      {/* Search and Filter Section for Charge Cards */}
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row">
        <div className="relative max-w-xs">
          <Input
            placeholder="Search"
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
        <Button className="mt h-10 text-xs sm:text-sm">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          ADD CARD
        </Button>
      </div>

      <ChargeCardsTable cards={chargeCards} />
    </div>
  )
}
