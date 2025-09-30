'use client'

import { TeamHeader } from '@/app/[locale]/(back-office)/team/_components/team-header'
import { TeamTabMenu } from '@/app/[locale]/(back-office)/team/_components/team-tab-menu'
import { useI18n } from '@/lib/i18n'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { teamWalletOverviewMock } from '../../../mock/team-wallet'
import { ChargeCardsTab } from './charge-cards-tab'
import { Pagination } from './pagination'
import { TeamWalletTab } from './team-wallet-tab'

interface PaymentPageProps {
  teamId: string
}

export function PaymentPage({ teamId }: PaymentPageProps) {
  const { t } = useI18n()
  const params = useParams()

  const [activeSubTab, setActiveSubTab] = useState('team-wallet')
  const [searchQuery, setSearchQuery] = useState('')

  const { walletBalance, chargeSessions, chargeCards } = teamWalletOverviewMock

  return (
    <div className="space-y-6 p-4">
      {/* Header Section */}
      <TeamHeader teamId={teamId} pageTitle={t('team_tabs.team_wallet')} />

      {/* Navigation Tabs Section */}
      <div className="">
        <TeamTabMenu active="team-wallet" locale={String(params.locale)} teamId={teamId} />
      </div>

      {/* Main Content Section */}
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
