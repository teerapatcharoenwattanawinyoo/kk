import { useUser } from '@/app/[locale]/(auth)'

export function useTeamHostId() {
  const { data, isLoading, error } = useUser()
  const teamHostId = (data?.team_host_id ?? null) as string | number | null
  return { teamHostId, isLoading, error }
}
