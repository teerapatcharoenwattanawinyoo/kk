import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/lib/constants'

import type {
  TopUpTransactionsRequest,
  TopUpTransactionsResponse,
} from '../_schemas/team-wallet-topup-transactions.schema'
import type {
  TeamWalletBalanceResponse,
  WalletTransactionsRequest,
  WalletTransactionsResponse,
} from '../_services/TeamWalletQuery'
import {
  fetchTeamWalletBalance,
  fetchTopUpTransactions,
  fetchWalletTransactions,
} from '../_services/TeamWalletQuery'

const STALE_TIME = 60 * 1000 // 1 minute
const GC_TIME = 5 * 60 * 1000 // 5 minutes
const WALLET_TRANSACTIONS_STALE_TIME = 30 * 1000 // 30 seconds

// ============================================
// Team Wallet Balance Query
// ============================================
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

// ============================================
// Wallet Transactions Query
// ============================================
interface UseWalletTransactionsQueryProps {
  teamId?: string | number
  params: WalletTransactionsRequest
  enabled?: boolean
}

const useWalletTransactionsQuery = ({
  teamId,
  params,
  enabled = true,
}: UseWalletTransactionsQueryProps) => {
  return useQuery<WalletTransactionsResponse, Error>({
    queryKey: [
      ...QUERY_KEYS.TEAM_WALLET_TRANSACTIONS,
      teamId ?? null,
      params.page,
      params.limit,
      params.search,
      params.filter_by_status,
    ],
    queryFn: () => {
      if (teamId === undefined || teamId === null || teamId === '') {
        throw new Error('A valid team ID is required to fetch wallet transactions')
      }

      return fetchWalletTransactions(teamId, params)
    },
    enabled: enabled && teamId !== undefined && teamId !== null && teamId !== '',
    staleTime: WALLET_TRANSACTIONS_STALE_TIME,
    gcTime: GC_TIME,
  })
}

// ============================================
// Top-Up Transactions Query
// ============================================
interface UseTopUpTransactionsQueryOptions {
  teamId?: string | number
  params?: TopUpTransactionsRequest
}

const useTopUpTransactionsQuery = ({ teamId, params }: UseTopUpTransactionsQueryOptions) => {
  return useQuery<TopUpTransactionsResponse, Error>({
    queryKey: [
      ...QUERY_KEYS.TEAM_WALLET_TOPUP_TRANSACTIONS,
      teamId ?? null,
      params?.page ?? 1,
      params?.limit ?? 10,
      params?.search ?? '',
    ],
    queryFn: () => {
      if (teamId === undefined || teamId === null || teamId === '') {
        throw new Error('A valid team ID is required to fetch top-up transactions')
      }

      return fetchTopUpTransactions(teamId, params)
    },
    enabled: teamId !== undefined && teamId !== null && teamId !== '',
    staleTime: WALLET_TRANSACTIONS_STALE_TIME,
    gcTime: GC_TIME,
  })
}

export { useTeamWalletQuery, useTopUpTransactionsQuery, useWalletTransactionsQuery }
export type { UseTopUpTransactionsQueryOptions, UseWalletTransactionsQueryProps }
