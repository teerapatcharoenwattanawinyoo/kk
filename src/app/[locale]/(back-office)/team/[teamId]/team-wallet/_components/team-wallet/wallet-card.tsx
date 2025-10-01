'use client'

import { TeamWalletIcon } from '@/components/icons/TeamWalletIcon'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'

interface WalletCardProps {
  walletBalance: number
  teamId: string
  isLoading?: boolean
}

export function WalletCard({ walletBalance, teamId, isLoading = false }: WalletCardProps) {
  const safeBalance = Number.isFinite(walletBalance) ? walletBalance : 0
  const formattedBalance = safeBalance.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="relative h-40 w-full min-w-0 max-w-full overflow-hidden rounded-2xl sm:h-44 sm:max-w-sm md:h-52 md:max-w-md lg:h-56">
      <Image
        src="/assets/images/card/card.svg"
        alt="Wallet Card Background"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 420px, (max-width: 1024px) 520px, 600px"
        className="object-cover"
      />
      <div className="relative z-10 h-full p-4 pr-3 text-primary-foreground sm:p-6 sm:pr-4">
        <div className="mb-2 flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/20 sm:h-9 sm:w-9">
            <TeamWalletIcon />
          </div>
          <span className="text-sm font-medium md:text-base">Team Wallet</span>
          <div className="rounded-full bg-[#2D2D2D] px-2 py-0.5 sm:px-2.5">
            <p className="text-xs">Main</p>
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          <div className="text-2xl font-bold sm:text-3xl md:text-4xl">
            {isLoading ? (
              <Skeleton className="h-8 w-32 bg-muted/20 sm:h-10 sm:w-40 md:h-11 md:w-48" />
            ) : (
              `${formattedBalance} ฿`
            )}
          </div>
          <div className="text-[11px] font-light sm:text-xs">Team ID : {teamId}</div>
        </div>
      </div>
    </div>
  )
}
