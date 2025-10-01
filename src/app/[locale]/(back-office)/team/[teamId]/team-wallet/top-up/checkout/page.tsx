import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { TopUpCheckoutPage } from '../../_layers/presentation'

interface CheckoutPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
  searchParams: Promise<{
    amount?: string
  }>
}

const CheckoutPage = async ({ params, searchParams }: CheckoutPageProps) => {
  const { teamId, locale } = await params
  const { amount } = await searchParams

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <TopUpCheckoutPage amount={amount || '0'} teamId={teamId} locale={locale} />
    </TeamGuard>
  )
}

export default CheckoutPage
