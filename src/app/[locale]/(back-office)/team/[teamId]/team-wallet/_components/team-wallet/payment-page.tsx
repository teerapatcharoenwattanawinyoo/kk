'use client'

import { useI18n } from '@/lib/i18n'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { teamWalletMockData } from '../../mock/team-wallet.mock'
import { TeamWalletPageView, TeamWalletPageSubTab } from './team-wallet-page-view'

interface PaymentPageProps {
  teamId: string
}

const DEFAULT_SUB_TAB: TeamWalletPageSubTab = 'team-wallet'

export function PaymentPage({ teamId }: PaymentPageProps) {
  const { t } = useI18n()
  const params = useParams()

  const [activeSubTab, setActiveSubTab] = useState<TeamWalletPageSubTab>(DEFAULT_SUB_TAB)
  const [searchQuery, setSearchQuery] = useState('')

  const rawLocale = params.locale
  const locale = Array.isArray(rawLocale) ? rawLocale[0] ?? '' : rawLocale ?? ''

  return (
    <TeamWalletPageView
      teamId={teamId}
      locale={locale}
      pageTitle={t('team_tabs.team_wallet')}
      walletTabLabel={t('team_wallet.sub_tabs.team_wallet')}
      chargeCardsTabLabel={t('team_wallet.sub_tabs.charge_cards')}
      activeSubTab={activeSubTab}
      onSubTabChange={setActiveSubTab}
      walletBalance={teamWalletMockData.walletBalance}
      chargeSessions={teamWalletMockData.chargeSessions}
      chargeCards={teamWalletMockData.chargeCards}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    />
  )
}
