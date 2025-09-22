import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { ProcessContent } from '@/components/back-office/team/team-wallet/top-up/process-content'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface ProcessPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
  searchParams: Promise<{
    amount?: string
    method?: string
    orderId?: string
    methodData?: string
  }>
}

export default async function ProcessPage({ params, searchParams }: ProcessPageProps) {
  const { teamId, locale } = await params
  const { amount, method, orderId, methodData } = await searchParams

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
                <h2 className="text-oc-title-secondary text-2xl font-semibold">
                  ประมวลผลการชำระเงิน
                </h2>
              </div>
            </div>

            <div className="p-6">
              <ProcessContent
                amount={amount || '0'}
                method={method || ''}
                orderId={orderId || ''}
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
