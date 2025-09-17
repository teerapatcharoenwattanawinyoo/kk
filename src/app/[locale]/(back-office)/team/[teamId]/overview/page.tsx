import { TeamOverview } from '@/components/back-office/team/overview/team-overview'
import { TeamGuard } from '@/components/back-office/team/team-guard'

interface TeamOverviewPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

const TeamOverviewPage = async ({ params }: TeamOverviewPageProps) => {
  const { teamId, locale } = await params

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <TeamOverview teamId={teamId} />
    </TeamGuard>
  )
}

export default TeamOverviewPage
