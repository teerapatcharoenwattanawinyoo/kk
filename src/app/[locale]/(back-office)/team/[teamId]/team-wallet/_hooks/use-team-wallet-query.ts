
import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/lib/constants'

import { fetchTeamWalletBalance } from '../_services/TeamWalletQuery'
import type { TeamWalletBalanceResponse } from '../_services/TeamWalletQuery'

const STALE_TIME = 60 * 1000 // 1 minute
const GC_TIME = 5 * 60 * 1000 // 5 minutes

const useTeamWalletQuery = (teamGroupId?: string | number) => {
  return useQuery<TeamWalletBalanceResponse, Error>({
    queryKey: [...QUERY_KEYS.TEAM_WALLET, teamGroupId ?? null],
    queryFn: () => {
      if (teamGroupId === undefined || teamGroupId === null || teamGroupId === '') {
        throw new Error('A valid team group id is required to fetch team wallet balance')
      }

      return fetchTeamWalletBalance(teamGroupId)
    },
    enabled: teamGroupId !== undefined && teamGroupId !== null && teamGroupId !== '',
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}

export { useTeamWalletQuery }
