import { useQuery } from '@tanstack/react-query'

import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/constants'

import { fetchTeamList } from '@/modules/teams/services'
import type { TeamListParams, TeamListQueryResponse } from '@/modules/teams/schemas'

export const useTeams = (params?: TeamListParams) => {
  return useQuery<TeamListQueryResponse>({
    queryKey: [QUERY_KEYS.TEAMS, 'list', params],
    queryFn: () => fetchTeamList(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    meta: {
      queryName: API_ENDPOINTS.TEAM_GROUPS.TEAMS.LIST,
    },
  })
}
