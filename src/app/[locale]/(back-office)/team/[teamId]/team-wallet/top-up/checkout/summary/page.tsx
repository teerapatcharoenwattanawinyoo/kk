import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { topUpPaymentMethodSchema } from '../../../_schemas/top-up.schema'
import { SummaryContent } from '../../../_components/top-up/summary-content'

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

export default async function SummaryPage({ params, searchParams }: SummaryPageProps) {
  const { teamId, locale } = await params
  const { amount, method, methodData } = await searchParams

  // Parse method data if available
  let parsedMethodData
  try {
    parsedMethodData = methodData ? JSON.parse(decodeURIComponent(methodData)) : undefined
  } catch (error) {
    console.error('Error parsing methodData:', error)
    parsedMethodData = undefined
  }

  const parsedResult = parsedMethodData
    ? topUpPaymentMethodSchema.safeParse(parsedMethodData)
    : undefined
  const validatedMethodData = parsedResult?.success ? parsedResult.data : undefined

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col">
        <div className="flex-1 px-4 py-4 md:px-6">
          <div className="shadow-xs rounded-lg bg-card">
            <div className="border-b">
              <div className="flex items-center gap-6 p-4 pb-4">
                <Link
                  href={`/${locale}/team/${teamId}/team-wallet/top-up/checkout?amount=${amount}`}
                >
                  <Button
                    className="h-8 w-8 rounded-full bg-muted lg:h-9 lg:w-9"
                    variant={'ghost'}
                    size={'icon'}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                </Link>
                <h2 className="text-oc-title-secondary text-2xl font-semibold">Back</h2>
              </div>
            </div>

            <div className="p-6">
              <SummaryContent
                amount={amount || '0'}
                paymentMethod={method || ''}
                paymentMethodData={validatedMethodData}
                teamId={teamId}
                locale={locale}
              />
            </div>
          </div>
        </div>
      </div>
    </TeamGuard>
  )
}
