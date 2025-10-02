import { api } from '@/lib/api/config/axios-client'
import { API_ENDPOINTS } from '@/lib/constants'

import {
  TopUpTransactionsRequest,
  TopUpTransactionsResponse,
  TopUpTransactionsResponseSchema,
} from '../_schemas/team-wallet-topup-transactions.schema'
import {
  WalletTransactionsRequest,
  WalletTransactionsResponse,
  WalletTransactionsResponseSchema,
} from '../_schemas/team-wallet-transactions.schema'
import {
  TeamWalletBalanceResponse,
  TeamWalletBalanceResponseSchema,
} from '../_schemas/team-wallet.schema'
import { topUpTransactionsMockResponse } from '../mock/topup-transactions.mock'

const buildTeamWalletBalanceUrl = (teamGroupId: string | number) =>
  API_ENDPOINTS.TEAM_GROUPS.WALLET.BALANCE.replace(
    '{team_group_id}',
    encodeURIComponent(String(teamGroupId)),
  )

const buildWalletTransactionsUrl = (teamId: string | number) =>
  API_ENDPOINTS.TEAM_GROUPS.WALLET.TRANSACTIONS.replace('{id}', encodeURIComponent(String(teamId)))

const buildTopUpTransactionsUrl = (teamId: string | number) =>
  API_ENDPOINTS.TEAM_GROUPS.WALLET.TOPUP_TRANSACTIONS.replace(
    '{id}',
    encodeURIComponent(String(teamId)),
  )

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const extractWalletBalance = (payload: unknown): number | undefined => {
  if (typeof payload === 'number' && Number.isFinite(payload)) {
    return payload
  }

  if (!isRecord(payload)) {
    return undefined
  }

  const directCandidates = [
    payload['walletBalance'],
    payload['wallet_balance'],
    payload['balance'],
    payload['amount'],
  ]

  for (const candidate of directCandidates) {
    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
      return candidate
    }
  }

  if ('data' in payload) {
    const nested = extractWalletBalance(payload['data'])
    if (typeof nested === 'number') {
      return nested
    }
  }

  if ('result' in payload) {
    const nested = extractWalletBalance(payload['result'])
    if (typeof nested === 'number') {
      return nested
    }
  }

  return undefined
}

const normalizeTeamWalletBalanceResponse = (raw: unknown) => {
  const walletBalance = extractWalletBalance(raw)

  if (walletBalance === undefined) {
    throw new Error('Invalid wallet balance response structure')
  }

  const record = isRecord(raw) ? raw : {}
  const statusCode = typeof record['statusCode'] === 'number' ? record['statusCode'] : 200
  const message = typeof record['message'] === 'string' ? record['message'] : undefined

  return {
    ...(Number.isFinite(statusCode) ? { statusCode } : {}),
    ...(message ? { message } : {}),
    data: {
      walletBalance,
    },
  }
}

const logApiError = (action: string, error: unknown, context: Record<string, unknown>) => {
  console.error(`[TeamWalletQuery] ${action}`, {
    error,
    ...context,
    timestamp: new Date().toISOString(),
    errorMessage: error instanceof Error ? error.message : 'Unknown error',
    errorStack: error instanceof Error ? error.stack : undefined,
  })
}

const fetchTeamWalletBalance = async (
  teamGroupId: string | number,
): Promise<TeamWalletBalanceResponse> => {
  if (teamGroupId === undefined || teamGroupId === null || teamGroupId === '') {
    throw new Error('A valid team group id is required to fetch team wallet balance')
  }

  try {
    const endpoint = buildTeamWalletBalanceUrl(teamGroupId)
    const raw = await api.get<unknown>(endpoint)
    const normalized = normalizeTeamWalletBalanceResponse(raw)
    const parsed = TeamWalletBalanceResponseSchema.parse(normalized)

    if (parsed.statusCode !== undefined && parsed.statusCode !== 200) {
      throw new Error(parsed.message || 'Failed to fetch team wallet balance')
    }

    return parsed
  } catch (error) {
    logApiError('Failed to fetch team wallet balance', error, { teamGroupId })

    if (error instanceof Error) {
      throw error
    }

    throw new Error('Failed to fetch team wallet balance')
  }
}

export { fetchTeamWalletBalance }
export type { TeamWalletBalanceResponse }

const fetchWalletTransactions = async (
  teamId: string | number,
  params: WalletTransactionsRequest,
): Promise<WalletTransactionsResponse> => {
  if (teamId === undefined || teamId === null || teamId === '') {
    throw new Error('A valid team ID is required to fetch wallet transactions')
  }

  try {
    const endpoint = buildWalletTransactionsUrl(teamId)

    // Build query params
    const queryParams = new URLSearchParams()
    queryParams.append('page', String(params.page))
    queryParams.append('limit', String(params.limit))

    if (params.search) {
      queryParams.append('search', params.search)
    }

    if (params.filter_by_status !== undefined) {
      queryParams.append('filter_by_status', String(params.filter_by_status))
    }

    const url = `${endpoint}?${queryParams.toString()}`
    const raw = await api.get<unknown>(url)

    // Parse and validate response
    const parsed = WalletTransactionsResponseSchema.parse(raw)

    if (parsed.statusCode !== undefined && parsed.statusCode !== 200) {
      throw new Error(parsed.message || 'Failed to fetch wallet transactions')
    }

    return parsed
  } catch (error) {
    logApiError('Failed to fetch wallet transactions', error, { teamId, params })

    if (error instanceof Error) {
      throw error
    }

    throw new Error('Failed to fetch wallet transactions')
  }
}

export { fetchWalletTransactions }
export type { WalletTransactionsRequest, WalletTransactionsResponse }

const fetchTopUpTransactions = async (
  teamId: string | number,
  params?: TopUpTransactionsRequest,
): Promise<TopUpTransactionsResponse> => {
  if (teamId === undefined || teamId === null || teamId === '') {
    throw new Error('A valid team ID is required to fetch top-up transactions')
  }

  // TODO: Remove mock data when API is ready
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    // Return mock data for now
    const mockResponse = { ...topUpTransactionsMockResponse }

    // Apply search filter if provided
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      mockResponse.data.items = mockResponse.data.items.filter(
        (item) =>
          item.code.toLowerCase().includes(searchLower) ||
          item.payment_method.toLowerCase().includes(searchLower),
      )
    }

    // Apply pagination if provided
    if (params?.page && params?.limit) {
      const startIndex = (params.page - 1) * params.limit
      const endIndex = startIndex + params.limit
      mockResponse.data.items = mockResponse.data.items.slice(startIndex, endIndex)
    }

    // Validate response structure
    const parsed = TopUpTransactionsResponseSchema.parse(mockResponse)

    return parsed

    /*
    // Real API implementation (uncomment when API is ready)
    const endpoint = buildTopUpTransactionsUrl(teamId)

    // Build query params if provided
    const queryParams = new URLSearchParams()
    if (params?.page) {
      queryParams.append('page', String(params.page))
    }
    if (params?.limit) {
      queryParams.append('limit', String(params.limit))
    }
    if (params?.search) {
      queryParams.append('search', params.search)
    }

    const url = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint
    const raw = await api.get<unknown>(url)

    // Parse and validate response
    const parsed = TopUpTransactionsResponseSchema.parse(raw)

    if (parsed.statusCode !== undefined && parsed.statusCode !== 200) {
      throw new Error(parsed.message || 'Failed to fetch top-up transactions')
    }

    return parsed
    */
  } catch (error) {
    logApiError('Failed to fetch top-up transactions', error, { teamId, params })

    if (error instanceof Error) {
      throw error
    }

    throw new Error('Failed to fetch top-up transactions')
  }
}

export { fetchTopUpTransactions }
export type { TopUpTransactionsRequest, TopUpTransactionsResponse }
