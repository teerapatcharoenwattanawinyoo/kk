import { TeamGuard } from '@/components/back-office/team/team-guard'
import { MembersPage } from '@/components/back-office/team/team-wallet/members-page'

interface MembersPageProps {
  params: Promise<{
    locale: string
    teamId: string
  }>
}

export default async function TeamMembersPage({ params }: MembersPageProps) {
  const { teamId, locale } = await params
  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <MembersPage teamId={teamId} />
    </TeamGuard>
  )
}
