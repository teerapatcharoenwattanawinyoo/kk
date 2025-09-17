import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/lib/constants'

import { fetchLegacyTeamList, fetchTeamDetails } from '@/modules/teams/services'
import type { TeamData, TeamListResponse } from '@/modules/teams/schemas'

import { useTeams } from './use-team-list'

export const useTeamById = (teamId: string) => {
  const { data: teamsData, isLoading, error } = useTeams()

  const team = useMemo(() => {
    if (!teamsData?.data?.data) return null

    return teamsData.data.data.find((item) => item.team_group_id.toString() === teamId) || null
  }, [teamsData, teamId])

  return {
    team,
    isLoading,
    error,
    isNotFound: !isLoading && !error && !!teamsData?.data && !team,
  }
}

export const useTeamData = (teamId: string) => {
  const { team } = useTeamById(teamId)
  return team
}

export const useTeamList = () => {
  return useQuery<TeamListResponse>({
    queryKey: QUERY_KEYS.TEAMS,
    queryFn: fetchLegacyTeamList,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useTeam = (teamId: string) => {
  return useQuery<TeamData | null>({
    queryKey: [...QUERY_KEYS.TEAM, teamId],
    queryFn: () => fetchTeamDetails(teamId),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}
