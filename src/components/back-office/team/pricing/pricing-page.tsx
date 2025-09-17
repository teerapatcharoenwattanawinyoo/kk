'use client'
import { TeamTabMenu } from '@/components/back-office/team/settings/TeamTabMenu'
import { TeamHeader } from '@/components/back-office/team/team-header'
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
import { usePriceSet } from '@/hooks/use-price-group'
import { PriceGroup } from '@/lib/api/team-group/price-groups'
import { useI18n } from '@/lib/i18n'
import { useTeam } from '@/modules/teams/hooks/use-teams'
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
  const transformPriceGroupToItem = (group: PriceGroup) => ({
    id: group.id.toString(),
    name: group.name || `Null ${group.id}`,
    price: parseFloat(group.price_per_kwh || '0'),
    unit: 'THB/kWh',
    appliedTo: '0',
    type: group.type,
    details: `${group.price_per_kwh} THB/kWh`,
  })

  const currentPrices =
    priceGroups && priceGroups.length > 0 ? priceGroups.map(transformPriceGroupToItem) : []

  // UI
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <TeamHeader teamId={teamId} pageTitle={t('team_tabs.pricing')} />
      {/* Navigation Tabs Section */}
      <div className="px-4 md:px-6">
        <TeamTabMenu active="price-groups" locale={String(params.locale)} teamId={teamId} />
      </div>
      <div className="flex-1 px-4 py-4 md:px-6">
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
                        ? 'text-title border-b-2 border-primary py-1 font-medium'
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
                        ? 'text-title border-b-2 border-primary py-1 font-medium'
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
                          <h3 className="text-title text-sm font-medium">{price.name}</h3>
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
