
import { api } from '@/lib/api/config/axios-client'
import { API_ENDPOINTS } from '@/lib/constants'

import {
  TeamWalletBalanceResponse,
  TeamWalletBalanceResponseSchema,
} from '../_schemas/team-wallet.schema'

const buildTeamWalletBalanceUrl = (teamGroupId: string | number) =>
  API_ENDPOINTS.TEAM_GROUPS.WALLET.BALANCE.replace(
    '{team_group_id}',
    encodeURIComponent(String(teamGroupId)),
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
