import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { OverviewTeamPage } from './_components/overview-team-page'

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
      <OverviewTeamPage teamId={teamId} />
    </TeamGuard>
  )
}

export default TeamOverviewPage
