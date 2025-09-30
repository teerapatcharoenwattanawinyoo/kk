import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { RevenuePage as RevenueContent } from './_components/revenue-page'

interface RevenuePageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

const RevenuePage = async ({ params }: RevenuePageProps) => {
  const { teamId, locale } = await params
  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <RevenueContent teamId={teamId} locale={locale} />
    </TeamGuard>
  )
}

export default RevenuePage
