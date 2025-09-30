'use client'

import { TeamHeader } from '@/app/[locale]/(back-office)/team/_components/team-header'
import { TeamTabMenu } from '@/app/[locale]/(back-office)/team/_components/team-tab-menu'
import { useI18n } from '@/lib/i18n'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { ChargeCard, ChargeSession } from '../../_schemas/team-wallet.schema'
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

  // Mock data for wallet balance
  const walletBalance = 23780.0

  // Mock data for charge sessions
  const chargeSessions: ChargeSession[] = [
    {
      orderNumber: 'CP00378653-379',
      location: 'Nonthaburi, Nonthaburi',
      station: 'OneCharge Charging Station',
      charger: 'Phevn Charger 1',
      rate: '89.0/kWh',
      startCharge: '9/7/2023 5:16 PM',
      stopCharge: '9/7/2023 6:16 PM',
      time: '1 hr',
      kWh: '11 kWh',
      revenue: '899.0',
      status: 'Completed',
    },
    {
      orderNumber: 'CP00378653-378',
      location: '182 2/5 ถ.ทรงวาด ซอย 7',
      station: 'OneCharge Charging Station',
      charger: 'Phevn Charger 1',
      rate: '89.0/kWh',
      startCharge: '9/7/2023 5:16 PM',
      stopCharge: '9/7/2023 6:16 PM',
      time: '1 hr',
      kWh: '11 kWh',
      revenue: '899.0',
      status: 'Completed',
    },
    {
      orderNumber: 'CP00378653-377',
      location: '30, 99 Bangplad Soi 4 Rama',
      station: 'OneCharge Charging Station',
      charger: 'Phevn Charger 1',
      rate: '89.0/kWh',
      startCharge: '9/7/2023 5:16 PM',
      stopCharge: '9/7/2023 6:16 PM',
      time: '1 hr',
      kWh: '11 kWh',
      revenue: '899.0',
      status: 'Completed',
    },
    {
      orderNumber: 'CP00378653-376',
      location: 'Nonthaburi, Nonthaburi',
      station: 'OneCharge Charging Station',
      charger: 'Phevn Charger 1',
      rate: '89.0/kWh',
      startCharge: '9/7/2023 5:16 PM',
      stopCharge: '9/7/2023 6:16 PM',
      time: '1 hr',
      kWh: '11 kWh',
      revenue: '899.0',
      status: 'Completed',
    },
  ]

  // Mock data for charge cards
  const chargeCards: ChargeCard[] = [
    {
      id: '1',
      cardId: '182787',
      owner: 'Jean Thiraphat',
      accessibility: 'All',
      status: 'Active',
      created: '12/01/2023\n11 : 23 : 38',
    },
    {
      id: '2',
      cardId: '182781',
      owner: 'No owner',
      accessibility: 'Selected',
      status: 'Hold',
      created: 'N/A',
    },
    {
      id: '3',
      cardId: '182783',
      owner: 'No owner',
      accessibility: 'Selected',
      status: 'Hold',
      created: 'N/A',
    },
  ]

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
