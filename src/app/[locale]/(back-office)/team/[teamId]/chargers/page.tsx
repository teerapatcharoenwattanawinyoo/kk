"use client"

import { ChargersPage } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_components/chargers/chargers-page'
import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { use } from 'react'

export default function TeamChargersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; teamId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { teamId, locale } = use(params)
  const resolvedSearchParams = use(searchParams)

  const rawPage = resolvedSearchParams?.page
  const rawPageSize = resolvedSearchParams?.pageSize
  const pageStr = Array.isArray(rawPage) ? rawPage[0] ?? '1' : rawPage ?? '1'
  const pageSizeStr = Array.isArray(rawPageSize)
    ? rawPageSize[0] ?? '10'
    : rawPageSize ?? '10'

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <ChargersPage
        teamId={teamId}
        locale={locale}
        page={pageStr}
        pageSize={pageSizeStr}
      />
    </TeamGuard>
  )
}
