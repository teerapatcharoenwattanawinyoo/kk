'use client'

import { ChargeCard } from '../../_schemas/team-wallet.schema'
import { ChargeCardsTable } from './charge-cards-table'

interface ChargeCardsTabProps {
  chargeCards: ChargeCard[]
}

const ChargeCardsTab = ({ chargeCards }: ChargeCardsTabProps) => {
  return (
    <div className="mt-4">
      <ChargeCardsTable cards={chargeCards} />
    </div>
  )
}

export { ChargeCardsTab }
