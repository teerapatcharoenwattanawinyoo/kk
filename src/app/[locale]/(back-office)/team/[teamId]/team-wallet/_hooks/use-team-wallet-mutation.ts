
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/lib/constants'

import {
  refreshTeamWalletBalance,
  type RefreshTeamWalletBalanceVariables,
} from '../_services/TeamWalletMutation'
import type { TeamWalletBalanceResponse } from '../_services/TeamWalletQuery'

const useTeamWalletMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<TeamWalletBalanceResponse, Error, RefreshTeamWalletBalanceVariables>({
    mutationFn: refreshTeamWalletBalance,
    onSuccess: (data, variables) => {
      queryClient.setQueryData([...QUERY_KEYS.TEAM_WALLET, variables.teamGroupId], data)
    },
  })
}

export { useTeamWalletMutation }
