import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/lib/constants'

import { fetchTeamHostList } from '@/modules/teams/services'
import type { TeamHostListParams, TeamHostListResponse } from '@/modules/teams/schemas'

import { useUserData } from './use-user-data'

export const useTeamHostList = (params?: TeamHostListParams) => {
  return useQuery<TeamHostListResponse>({
    queryKey: [QUERY_KEYS.TEAMS, 'host-list', params],
    queryFn: () => fetchTeamHostList(params),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useTeamHostById = (teamId: string) => {
  const { data, isLoading, error } = useTeamHostList()

  const teamData = useMemo(() => {
    if (!data?.data?.data || !teamId) return null

    return data.data.data.find((team) => team.team_group_id.toString() === teamId) || null
  }, [data, teamId])

  return {
    ...teamData,
    isLoading,
    error,
  }
}

export const useTeamHostId = () => {
  const userData = useUserData()
  return userData?.user?.team_host_id || null
}
