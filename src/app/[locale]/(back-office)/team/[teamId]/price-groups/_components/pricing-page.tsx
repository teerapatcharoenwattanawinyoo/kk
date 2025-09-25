'use client'
import { usePriceSet } from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_hooks/use-price-group'
import { PriceGroup } from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_servers/price-groups'
import { TeamHeader } from '@/app/[locale]/(back-office)/team/_components/team-header'
import { TeamTabMenu } from '@/app/[locale]/(back-office)/team/_components/team-tab-menu'
import { useTeam } from '@/app/[locale]/(back-office)/team/_hooks/use-teams'
import { PublicPriceIcon } from '@/components/icons'
import { MemberPriceIcon } from '@/components/icons/MemberPriceIcon'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/lib/i18n'
import { ChevronRight, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { PricingSkeleton } from './pricing-skeleton'

interface PricingPageProps {
  teamId: string
}

export function PricingPage({ teamId }: PricingPageProps) {
  const { t } = useI18n()
  const params = useParams()
  const router = useRouter()

  const [activeSubTab, setActiveSubTab] = useState('public-price')

  const { data: teamData, isLoading: isTeamLoading, error: teamError } = useTeam(teamId)

  const {
    data: pricingData,
    isLoading: isPricingLoading,
    isError: isPricingError,
  } = usePriceSet(activeSubTab === 'public-price' ? 'general' : 'member', 1, 50)

  const priceGroups = pricingData?.data?.data || []

  const isLoading = isTeamLoading || isPricingLoading
  const isError = teamError || isPricingError

  // Transform API data to display format
  const formatNumber = (value?: string) => {
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

  const transformPriceGroupToItem = (group: PriceGroup) => {
    const pricePerKwh = formatNumber(group.price_per_kwh)
    const pricePerMinute = formatNumber(group.price_per_minute)
    const onPeak = formatNumber(group.price_on_peak)
    const offPeak = formatNumber(group.price_off_peak)

    let unitLabel = '฿/kWh'
    let detailText = pricePerKwh ? `${pricePerKwh} ฿/kWh` : ''
    let primaryPrice = pricePerKwh ? parseFloat(group.price_per_kwh) : 0

    if (group.type === 'PER_MINUTE') {
      unitLabel = '฿/Hrs'
      const segments = [
        pricePerKwh ? `${pricePerKwh} ฿/kWh` : null,
        pricePerMinute ? `${pricePerMinute} ฿/Hrs` : null,
      ].filter(Boolean)
      detailText = segments.join(' · ')
      primaryPrice = pricePerMinute ? parseFloat(group.price_per_minute) : primaryPrice
    } else if (group.type === 'PEAK') {
      unitLabel = 'On peak / Off peak'
      const segments = [
        onPeak ? `On peak ${onPeak} ฿` : null,
        offPeak ? `Off peak ${offPeak} ฿` : null,
      ].filter(Boolean)
      detailText = segments.join(' · ')
      primaryPrice = onPeak ? parseFloat(group.price_on_peak) : primaryPrice
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
      type: group.type,
      details: detailText,
    }
  }

  const currentPrices =
    priceGroups && priceGroups.length > 0 ? priceGroups.map(transformPriceGroupToItem) : []

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
                  <div className="h-8 w-px bg-[#CDD5DE]" />
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
            <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
              {currentPrices.map((price) => (
                <Card key={price.id} className="overflow-hidden border shadow-none">
                  <CardContent className="p-1">
                    <div className="flex h-60 items-start justify-between px-4">
                      <div className="flex items-start gap-2">
                        {activeSubTab === 'public-price' ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full">
                            <PublicPriceIcon />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center">
                            <MemberPriceIcon />
                          </div>
                        )}
                        <div>
                          <h3 className="text-oc-title-secondary text-sm font-medium">
                            {price.name}
                          </h3>
                          {price.unit && (
                            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[#4361ee]">
                              {price.unit}
                            </p>
                          )}
                          {price.details && (
                            <p className="mt-1 text-xs text-muted-foreground">{price.details}</p>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem
                            onClick={() => {
                              // handle edit
                              router.push(
                                activeSubTab === 'public-price'
                                  ? `price-groups/edit-price-group?priceId=${price.id}`
                                  : `price-groups/edit-member-price-group?priceId=${price.id}`,
                              )
                            }}
                            className="flex items-center gap-2"
                          >
                            <Pencil className="h-4 w-4" /> {t('buttons.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              // handle delete
                            }}
                            className="flex items-center gap-2 text-destructive"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <p className="text-destructive">{t('buttons.delete')}</p>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t p-3">
                    <div className="flex items-center gap-2 px-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                        {price.appliedTo}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {t('pricing.applied_to')} {price.appliedTo}{' '}
                        {activeSubTab === 'public-price'
                          ? t('chargers.chargers_name')
                          : t('pricing.members_price')}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-[#818894]">
                      <span>{t('buttons.see_more')}</span>
                      <ChevronRight className="h-12 w-12" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
