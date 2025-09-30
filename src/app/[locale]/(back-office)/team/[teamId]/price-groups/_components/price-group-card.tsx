'use client'

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
import { ChevronRight, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { StatusTypeSchema, type PriceType, type StatusType } from '../_schemas'

export type PriceCardItem = {
  id: string
  name: string
  price: number
  unit: string
  appliedTo: string
  type: PriceType
  details: string
}

export type PriceGroupCategory = StatusType

type PriceGroupCardGridProps = {
  prices: PriceCardItem[]
  category: PriceGroupCategory
}

const PriceGroupCard = ({ prices, category }: PriceGroupCardGridProps) => {
  const router = useRouter()
  const { t } = useI18n()

  const isGeneral = category === StatusTypeSchema.enum.GENERAL
  const editPath = isGeneral
    ? 'price-groups/edit-price-group'
    : 'price-groups/edit-member-price-group'
  const seeMoreLabel = t('buttons.see_more')
  const appliedLabel = t('pricing.applied_to')
  const appliedSubject = isGeneral ? t('chargers.chargers_name') : t('pricing.members_price')

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
      {prices.map((price) => (
        <Card
          key={price.id}
          className="group overflow-hidden rounded-xl border shadow-none transition-colors focus-within:ring-1 focus-within:ring-muted/60 hover:bg-muted/30 hover:ring-1 hover:ring-muted/60"
        >
          <CardContent className="p-0">
            <div className="relative grid grid-cols-[1fr_auto] items-start gap-3 px-4 py-4">
              <div className="flex items-start gap-2">
                {isGeneral ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60">
                    <PublicPriceIcon />
                  </div>
                ) : (
                  <MemberPriceIcon className="size-8 text-primary" />
                )}
                <div>
                  <h3 className="text-oc-title-secondary line-clamp-2 text-[13px] font-medium leading-snug">
                    {price.name}
                  </h3>
                  {price.unit && (
                    <p className="mt-1 text-[12px] text-muted-foreground">{price.unit}</p>
                  )}
                  {price.details && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {price.details}
                    </p>
                  )}
                </div>
              </div>
              <div className="justify-self-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted/50 focus-visible:ring-1 focus-visible:ring-muted/60"
                      aria-label={t('buttons.more_options')}
                    >
                      <MoreHorizontal className="size-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem
                      onClick={() => {
                        router.push(`${editPath}?priceId=${price.id}`)
                      }}
                      className="flex items-center gap-2"
                    >
                      <Pencil className="size-4" /> {t('buttons.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        // TODO: wire delete handler
                      }}
                      className="flex items-center gap-2 text-destructive"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <p className="text-destructive">{t('buttons.delete')}</p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t px-4 py-3">
            <div className="flex items-center gap-2 px-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {price.appliedTo}
              </div>
              <span className="text-xs text-muted-foreground">
                {appliedLabel} {price.appliedTo} {appliedSubject}
              </span>
            </div>
            <Button
              variant="link"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-1 focus-visible:ring-muted/60"
              aria-label={seeMoreLabel}
            >
              <span>{seeMoreLabel}</span>
              <ChevronRight className="size-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default PriceGroupCard
