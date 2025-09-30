'use client'

import { TeamHeader } from '@/app/[locale]/(back-office)/team/_components/team-header'
import { TeamTabMenu } from '@/app/[locale]/(back-office)/team/_components/team-tab-menu'
import { useI18n } from '@/lib/i18n'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import {
  chargeCardsMock,
  chargeSessionsMock,
  walletBalanceMock,
} from '../../mock/team-wallet.mock'
import { ChargeCard, ChargeSession } from '../../_schemas/team-wallet.schema'
import { ChargeCardsTab } from '../../_components/team-wallet/charge-cards-tab'
import { Pagination } from '../../_components/team-wallet/pagination'
import { TeamWalletTab } from '../../_components/team-wallet/team-wallet-tab'

type TeamWalletSubTab = 'team-wallet' | 'charge-cards'

interface TeamWalletPageProps {
  teamId: string
}

export function TeamWalletPage({ teamId }: TeamWalletPageProps) {
  const { t } = useI18n()
  const params = useParams()

  const [activeSubTab, setActiveSubTab] = useState<TeamWalletSubTab>('team-wallet')
  const [searchQuery, setSearchQuery] = useState('')

  const walletBalance = walletBalanceMock
  const chargeSessions: ChargeSession[] = chargeSessionsMock
  const chargeCards: ChargeCard[] = chargeCardsMock

  return (
    <div className="space-y-6 p-4">
      <TeamHeader teamId={teamId} pageTitle={t('team_tabs.team_wallet')} />

      <div>
        <TeamTabMenu active="team-wallet" locale={String(params.locale)} teamId={teamId} />
      </div>

      <div className="flex-1">
        <div className="shadow-xs rounded-lg bg-card">
          <div className="p-4 md:p-6">
            <div className="border-b">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setActiveSubTab('team-wallet')}
                  className={`pb-2 text-2xl font-medium tracking-[-0.84px] ${
                    activeSubTab === 'team-wallet'
                      ? 'text-oc-title-secondary border-b-2 border-primary py-1 font-medium'
                      : 'py-1 text-[#A1B1D1]'
                  }`}
                >
                  Team Wallet
                </button>
                <div className="h-8 w-px bg-[#CDD5DE]" />
                <button
                  onClick={() => setActiveSubTab('charge-cards')}
                  className={`pb-2 text-2xl font-medium tracking-[-0.84px] ${
                    activeSubTab === 'charge-cards'
                      ? 'text-oc-title-secondary border-b-2 border-primary py-1 font-medium'
                      : 'py-1 text-[#A1B1D1]'
                  }`}
                >
                  Charge cards
                </button>
              </div>
            </div>

            {activeSubTab === 'team-wallet' ? (
              <TeamWalletTab
                teamId={teamId}
                walletBalance={walletBalance}
                chargeSessions={chargeSessions}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            ) : (
              <ChargeCardsTab chargeCards={chargeCards} />
            )}

            <Pagination />
          </div>
        </div>
      </div>
    </div>
  )
}
