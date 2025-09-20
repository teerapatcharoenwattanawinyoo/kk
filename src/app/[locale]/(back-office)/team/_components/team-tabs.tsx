'use client'

import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

interface TeamTabsProps {
  teamId: string
  activeTab: string
}

export function TeamTabs({ teamId, activeTab }: TeamTabsProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const teamPath = ROUTES.TEAM + `/${teamId}`
    if (pathname === teamPath) {
      router.push(ROUTES.TEAM_OVERVIEW.replace('[id]', teamId))
    }
  }, [pathname, teamId, router])

  const getHrefWithParams = (baseHref: string) => {
    const currentParams = new URLSearchParams()

    if (baseHref.includes('/chargers')) {
      const page = searchParams.get('page')
      const pageSize = searchParams.get('pageSize')

      if (page) currentParams.set('page', page)
      if (pageSize) currentParams.set('pageSize', pageSize)
    }

    const queryString = currentParams.toString()
    return queryString ? `${baseHref}?${queryString}` : baseHref
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      href: ROUTES.TEAM_OVERVIEW.replace('[id]', teamId),
    },
    {
      id: 'charging-stations',
      label: 'Charging Stations',
      href: ROUTES.TEAM_CHARGING_STATIONS.replace('[id]', teamId),
    },
    {
      id: 'chargers',
      label: 'Chargers',
      href: ROUTES.TEAM_CHARGERS.replace('[id]', teamId),
    },
    {
      id: 'members',
      label: 'Members',
      href: ROUTES.TEAM_MEMBERS.replace('[id]', teamId),
    },
    {
      id: 'pricing',
      label: 'Pricing',
      href: ROUTES.TEAM_PRICING.replace('[id]', teamId),
    },
    {
      id: 'payment',
      label: 'Payments',
      href: ROUTES.TEAM_PAYMENT.replace('[id]', teamId),
    },
    {
      id: 'revenue',
      label: 'Revenue',
      href: ROUTES.TEAM_REVENUE.replace('[id]', teamId),
    },
    {
      id: 'vehicles',
      label: 'Vehicles',
      href: ROUTES.TEAM_VEHICLES.replace('[id]', teamId),
    },
    {
      id: 'settings',
      label: 'Settings',
      href: ROUTES.TEAM_SETTINGS.replace('[id]', teamId),
    },
  ]

  return (
    <div className="overflow-x-auto rounded-lg bg-card px-2 py-2">
      <div className="flex min-w-max font-semibold">
        {tabs.map((tab) => {
          const isCurrentPath = pathname === tab.href

          // ถ้าเป็นหน้าปัจจุบัน ให้ใช้ button แทน Link เพื่อป้องกันการนำทางซ้ำ
          if (isCurrentPath) {
            return (
              <button
                key={tab.id}
                className={cn(
                  'min-w-[100px] flex-1 truncate px-4 py-2 text-center text-sm transition-colors',
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            )
          }

          return (
            <Link
              key={tab.id}
              href={getHrefWithParams(tab.href)}
              className={cn(
                'min-w-[100px] flex-1 truncate px-4 py-2 text-center text-sm transition-colors',
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-[#6E82A5] hover:text-foreground',
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
