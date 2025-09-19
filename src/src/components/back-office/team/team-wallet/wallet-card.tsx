'use client'

import { TeamWalletIcon } from '@/components/icons/TeamWalletIcon'
import Image from 'next/image'

interface WalletCardProps {
  walletBalance: number
  teamId: string
}

export function WalletCard({ walletBalance, teamId }: WalletCardProps) {
  return (
    <div className="relative h-44 w-full max-w-xs overflow-hidden rounded-2xl">
      <Image
        src="/assets/images/card/card.svg"
        alt="Wallet Card Background"
        fill
        className="object-cover"
      />
      <div className="relative z-10 h-full p-6 pr-4 text-white">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <TeamWalletIcon />
          </div>
          <span className="text-sm font-medium">Team Wallet</span>
          <div className="rounded-full bg-[#2D2D2D] px-2 py-0.5">
            <p className="text-xs">Main</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="text-3xl font-bold">
            {walletBalance.toLocaleString()} ฿
          </div>
          <div className="text-xs font-light">Team ID : {teamId}</div>
        </div>
      </div>
    </div>
  )
}
