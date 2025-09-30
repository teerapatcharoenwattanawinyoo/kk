'use client'
import { usePriceSet } from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_hooks'
import { PriceGroup, PriceSetTypeSchema } from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_schemas'
import { TeamHeader } from '@/app/[locale]/(back-office)/team/_components/team-header'
import { TeamTabMenu } from '@/app/[locale]/(back-office)/team/_components/team-tab-menu'
import { useTeam } from '@/app/[locale]/(back-office)/team/_hooks/use-teams'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import type { PriceType } from '../_schemas'
import type { PriceCardItem, PriceGroupCategory } from './price-group-card'
import PriceGroupCard from './price-group-card'
import { PricingSkeleton } from './pricing-skeleton'

interface PricingPageProps {
  teamId: string
}

const PricingPage = ({ teamId }: PricingPageProps) => {
  const { t } = useI18n()
  const params = useParams()
  const router = useRouter()

  const [activeSubTab, setActiveSubTab] = useState('public-price')

  const { data: teamData, isLoading: isTeamLoading, error: teamError } = useTeam(teamId)
  const teamGroupId = teamData?.team_group_id ?? null

  const {
    data: pricingData,
    isLoading: isPricingLoading,
    isError: isPricingError,
  } = usePriceSet(
    activeSubTab === 'public-price'
      ? PriceSetTypeSchema.enum.general
      : PriceSetTypeSchema.enum.member,
    1,
    50,
    teamGroupId,
  )
  const isPriceSetLoading = isPricingLoading || teamGroupId === null

  const priceGroupsRaw = Array.isArray(pricingData?.data)
    ? pricingData?.data
    : pricingData?.data?.data

  const priceGroups: PriceGroup[] = Array.isArray(priceGroupsRaw) ? priceGroupsRaw : []

  const isLoading = isTeamLoading || isPriceSetLoading
  const isError = teamError || isPricingError

  // Transform API data to display format
  const formatNumber = (value?: string | null) => {
    if (!value) return null
    const numeric = parseFloat(value)
    if (Number.isNaN(numeric)) return null
    return numeric.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const isFreePromotion = (group: PriceGroup) => {
    const descriptors = [
      group.starting_fee?.description,
      group.charging_fee?.description,
      group.minute_fee?.description,
      group.idle_fee?.description,
    ]
    return descriptors.some((desc) => desc?.toLowerCase().includes('free'))
  }

  const PRICE_TYPES: readonly PriceType[] = ['PER_KWH', 'PER_MINUTE', 'PEAK', 'TIERED_CREDIT']

  const transformPriceGroupToItem = (group: PriceGroup): PriceCardItem => {
    const pricePerKwh = formatNumber(group.price_per_kwh)
    const pricePerMinute = formatNumber(group.price_per_minute)
    const onPeak = formatNumber(group.price_on_peak)
    const offPeak = formatNumber(group.price_off_peak)

    const resolvedType: PriceType = PRICE_TYPES.includes(group.type as PriceType)
      ? (group.type as PriceType)
      : 'PER_KWH'

    let unitLabel = '฿/kWh'
    let detailText = pricePerKwh ? `${pricePerKwh} ฿/kWh` : ''
    let primaryPrice = pricePerKwh ? Number(group.price_per_kwh ?? 0) : 0

    if (group.type === 'PER_MINUTE') {
      unitLabel = '฿/Hrs'
      const segments = [
        pricePerKwh ? `${pricePerKwh} ฿/kWh` : null,
        pricePerMinute ? `${pricePerMinute} ฿/Hrs` : null,
      ].filter(Boolean)
      detailText = segments.join(' · ')
      primaryPrice = pricePerMinute ? Number(group.price_per_minute ?? 0) : primaryPrice
    } else if (group.type === 'PEAK') {
      unitLabel = 'On peak / Off peak'
      const segments = [
        onPeak ? `On peak ${onPeak} ฿` : null,
        offPeak ? `Off peak ${offPeak} ฿` : null,
      ].filter(Boolean)
      detailText = segments.join(' · ')
      primaryPrice = onPeak ? Number(group.price_on_peak ?? 0) : primaryPrice
    } else if (isFreePromotion(group)) {
      unitLabel = 'Free Charge Promotion'
      detailText =
        group.starting_fee?.description ||
        group.charging_fee?.description ||
        group.minute_fee?.description ||
        'Free charge promotion'
      primaryPrice = 0
    }

    return {
      id: group.id.toString(),
      name: group.name || `Null ${group.id}`,
      price: primaryPrice,
      unit: unitLabel,
      appliedTo: '0',
      type: resolvedType,
      details: detailText,
    }
  }

  const currentPrices = priceGroups.length > 0 ? priceGroups.map(transformPriceGroupToItem) : []

  const activeCategory: PriceGroupCategory = activeSubTab === 'public-price' ? 'GENERAL' : 'MEMBER'

  // UI
  return (
    <div className="space-y-6 p-4">
      <TeamHeader teamId={teamId} pageTitle={t('team_tabs.pricing')} />
      {/* Navigation Tabs Section */}
      <div className="">
        <TeamTabMenu active="price-groups" locale={String(params.locale)} teamId={teamId} />
      </div>
      <div className="flex-1">
        <div className="shadow-xs rounded-lg bg-card">
          {/* Tabs and Button Section (always visible) */}
          <div className="px-6 pb-4 pt-6">
            <div className="flex items-center justify-between border-b">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setActiveSubTab('public-price')}
                    className={`pb-2 text-2xl font-medium tracking-[-0.84px] ${
                      activeSubTab === 'public-price'
                        ? 'text-oc-title-secondary border-b-2 border-primary py-1 font-medium'
                        : 'py-1 text-[#A1B1D1]'
                    }`}
                  >
                    {t('pricing.general_price')}
                  </button>
                  <div className="h-8 w-px bg-border" />
                  <button
                    onClick={() => setActiveSubTab('member-price')}
                    className={`pb-2 text-2xl font-medium tracking-[-0.84px] ${
                      activeSubTab === 'member-price'
                        ? 'text-oc-title-secondary border-b-2 border-primary py-1 font-medium'
                        : 'py-1 text-[#A1B1D1]'
                    }`}
                  >
                    {t('pricing.members_price')}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 pb-2">
                <Button
                  className="flex h-9 items-center gap-[11.59px]"
                  onClick={() => {
                    router.push(
                      activeSubTab === 'public-price'
                        ? 'price-groups/add-price-group'
                        : 'price-groups/add-member-price-group',
                    )
                  }}
                >
                  <div className="h-[17.2px] w-[17.2px] shrink-0">
                    <Plus />
                  </div>
                  {activeSubTab === 'public-price'
                    ? t('buttons.add_public_price')
                    : t('buttons.add_member_price')}
                </Button>
              </div>
            </div>
          </div>
          {/* Cards Section */}
          {isLoading ? (
            <PricingSkeleton />
          ) : isError ? (
            <div className="flex items-center justify-center py-8 text-destructive">
              <span>Error loading pricing data. Please try again later.</span>
            </div>
          ) : !teamData ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <span>Team not found.</span>
            </div>
          ) : currentPrices.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <span>No pricing data available.</span>
            </div>
          ) : (
            <PriceGroupCard prices={currentPrices} category={activeCategory} />
          )}
        </div>
      </div>
    </div>
  )
}

export { PricingPage }
