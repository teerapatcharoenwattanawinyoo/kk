import { TeamHeader } from '@/app/[locale]/(back-office)/team/_components/team-header'
import { TeamTabMenu } from '@/app/[locale]/(back-office)/team/_components/team-tab-menu'
import { ChargeCard, ChargeSession } from '../../_schemas/team-wallet.schema'
import { ChargeCardsTab } from './charge-cards-tab'
import { Pagination } from './pagination'
import { TeamWalletTab } from './team-wallet-tab'

export type TeamWalletPageSubTab = 'team-wallet' | 'charge-cards'

interface TeamWalletPageViewProps {
  teamId: string
  locale: string
  pageTitle: string
  walletTabLabel: string
  chargeCardsTabLabel: string
  activeSubTab: TeamWalletPageSubTab
  onSubTabChange: (subTab: TeamWalletPageSubTab) => void
  walletBalance: number
  chargeSessions: ChargeSession[]
  chargeCards: ChargeCard[]
  searchQuery: string
  onSearchQueryChange: (value: string) => void
}

export function TeamWalletPageView({
  teamId,
  locale,
  pageTitle,
  walletTabLabel,
  chargeCardsTabLabel,
  activeSubTab,
  onSubTabChange,
  walletBalance,
  chargeSessions,
  chargeCards,
  searchQuery,
  onSearchQueryChange,
}: TeamWalletPageViewProps) {
  const subTabs: Array<{ key: TeamWalletPageSubTab; label: string }> = [
    { key: 'team-wallet', label: walletTabLabel },
    { key: 'charge-cards', label: chargeCardsTabLabel },
  ]

  return (
    <div className="space-y-6 p-4">
      <TeamHeader teamId={teamId} pageTitle={pageTitle} />

      <div>
        <TeamTabMenu active="team-wallet" locale={locale} teamId={teamId} />
      </div>

      <div className="flex-1">
        <div className="shadow-xs rounded-lg bg-card">
          <div className="p-4 md:p-6">
            <div className="border-b">
              <div className="flex items-center gap-6">
                {subTabs.map(({ key, label }) => {
                  const isActive = activeSubTab === key

                  return (
                    <button
                      key={key}
                      onClick={() => onSubTabChange(key)}
                      className={`pb-2 text-2xl font-medium tracking-[-0.84px] ${
                        isActive
                          ? 'text-oc-title-secondary border-b-2 border-primary py-1 font-medium'
                          : 'py-1 text-[#A1B1D1]'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {activeSubTab === 'team-wallet' ? (
              <TeamWalletTab
                teamId={teamId}
                walletBalance={walletBalance}
                chargeSessions={chargeSessions}
                searchQuery={searchQuery}
                onSearchChange={onSearchQueryChange}
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
