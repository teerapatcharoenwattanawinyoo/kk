import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/lib/constants'

import type { TopUpTransactionsResponse } from '../_schemas/team-wallet-topup-transactions.schema'
import {
  refreshTeamWalletBalance,
  refreshTopUpTransactions,
  refreshWalletTransactions,
  type RefreshTeamWalletBalanceVariables,
  type RefreshTopUpTransactionsVariables,
  type RefreshWalletTransactionsVariables,
} from '../_services/TeamWalletMutation'
import type {
  TeamWalletBalanceResponse,
  WalletTransactionsResponse,
} from '../_services/TeamWalletQuery'

// ============================================
// Team Wallet Balance Mutation
// ============================================
const useTeamWalletMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<TeamWalletBalanceResponse, Error, RefreshTeamWalletBalanceVariables>({
    mutationFn: refreshTeamWalletBalance,
    onSuccess: (data, variables) => {
      queryClient.setQueryData([...QUERY_KEYS.TEAM_WALLET, variables.teamGroupId], data)
    },
  })
}

// ============================================
// Wallet Transactions Mutation
// ============================================
const useWalletTransactionsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<WalletTransactionsResponse, Error, RefreshWalletTransactionsVariables>({
    mutationFn: refreshWalletTransactions,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        [
          ...QUERY_KEYS.TEAM_WALLET_TRANSACTIONS,
          variables.teamId,
          variables.params.page,
          variables.params.limit,
          variables.params.search,
          variables.params.filter_by_status,
        ],
        data,
      )
    },
  })
}

// ============================================
// Top-Up Transactions Mutation
// ============================================
const useTopUpTransactionsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<TopUpTransactionsResponse, Error, RefreshTopUpTransactionsVariables>({
    mutationFn: refreshTopUpTransactions,
    onSuccess: (data, variables) => {
      // Invalidate all queries with this team ID
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.TEAM_WALLET_TOPUP_TRANSACTIONS, variables.teamId],
      })
    },
  })
}

export { useTeamWalletMutation, useTopUpTransactionsMutation, useWalletTransactionsMutation }
