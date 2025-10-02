import type { TopUpTransactionsRequest, WalletTransactionsRequest } from './TeamWalletQuery'
import {
  fetchTeamWalletBalance,
  fetchTopUpTransactions,
  fetchWalletTransactions,
} from './TeamWalletQuery'

interface RefreshTeamWalletBalanceVariables {
  teamGroupId: string | number
}

interface RefreshWalletTransactionsVariables {
  teamId: string | number
  params: WalletTransactionsRequest
}

interface RefreshTopUpTransactionsVariables {
  teamId: string | number
  params?: TopUpTransactionsRequest
}

const refreshTeamWalletBalance = async ({ teamGroupId }: RefreshTeamWalletBalanceVariables) => {
  return fetchTeamWalletBalance(teamGroupId)
}

const refreshWalletTransactions = async ({
  teamId,
  params,
}: RefreshWalletTransactionsVariables) => {
  return fetchWalletTransactions(teamId, params)
}

const refreshTopUpTransactions = async ({ teamId, params }: RefreshTopUpTransactionsVariables) => {
  return fetchTopUpTransactions(teamId, params)
}

export { refreshTeamWalletBalance, refreshTopUpTransactions, refreshWalletTransactions }
export type {
  RefreshTeamWalletBalanceVariables,
  RefreshTopUpTransactionsVariables,
  RefreshWalletTransactionsVariables,
}
