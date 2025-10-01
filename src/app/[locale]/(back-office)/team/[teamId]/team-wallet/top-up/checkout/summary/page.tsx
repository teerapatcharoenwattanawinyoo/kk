import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'

import { topUpPaymentMethodSchema, type TopUpPaymentMethod } from '../../../_schemas/top-up.schema'
import { TopUpSummaryPage } from '../../../_layers/presentation'

interface SummaryPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
  searchParams: Promise<{
    amount?: string
    method?: string
    methodData?: string
  }>
}

const parsePaymentMethodData = (encoded?: string): TopUpPaymentMethod | undefined => {
  if (!encoded) {
    return undefined
  }

  try {
    const decoded = decodeURIComponent(encoded)
    const parsed = JSON.parse(decoded)
    const result = topUpPaymentMethodSchema.safeParse(parsed)

    if (result.success) {
      return result.data
    }

    console.error('[TopUpSummaryPage] Invalid payment method data', result.error)
  } catch (error) {
    console.error('[TopUpSummaryPage] Failed to parse payment method data', error)
  }

  return undefined
}

export default async function SummaryPage({ params, searchParams }: SummaryPageProps) {
  const { teamId, locale } = await params
  const { amount, method, methodData } = await searchParams

  const parsedMethodData = parsePaymentMethodData(methodData)

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <TopUpSummaryPage
        amount={amount || '0'}
        paymentMethod={method || ''}
        paymentMethodData={parsedMethodData}
        teamId={teamId}
        locale={locale}
      />
    </TeamGuard>
  )
}
