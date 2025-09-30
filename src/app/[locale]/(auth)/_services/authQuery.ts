import { api, localApi } from '@/lib/api/config/axios-server'
import { API_PROXY } from '@/lib/constants'
import { userSchema, type User } from '@/lib/schemas/user.schema'

import { GetPolicyResponseSchema, type GetPolicyResponse } from '../_schemas/policy.schema'

const fetchPolicy = async (): Promise<GetPolicyResponse> => {
  try {
    const response = await api.get<GetPolicyResponse>(API_PROXY.AUTH.POLICY)
    return GetPolicyResponseSchema.parse(response)
  } catch (error) {
    console.log('fetchPolicy', error)
    throw error instanceof Error ? error : new Error('Failed to fetch policy information')
  }
}

const fetchTerms = async (): Promise<GetPolicyResponse> => {
  try {
    const response = await api.get<GetPolicyResponse>(API_PROXY.AUTH.TERM)
    return GetPolicyResponseSchema.parse(response)
  } catch (error) {
    console.log('fetchTerms', error)
    throw error instanceof Error ? error : new Error('Failed to fetch terms information')
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const extractUser = (payload: unknown): unknown => {
  if (!isRecord(payload)) return payload

  if ('user' in payload) {
    const { user } = payload as { user?: unknown }
    return user
  }

  if ('data' in payload) {
    const { data } = payload as { data?: unknown }
    if (isRecord(data) && 'user' in data) {
      const { user } = data as { user?: unknown }
      return user
    }
    return data
  }

  return payload
}

const fetchCurrentUser = async (): Promise<User> => {
  try {
    const response = await localApi.get<unknown>('/api/auth/me')
    const candidate = extractUser(response)
    const parsed = userSchema.safeParse(candidate)

    if (!parsed.success) {
      throw new Error('Invalid user payload received from /api/auth/me')
    }

    return parsed.data
  } catch (error) {
    console.log('fetchCurrentUser', error)
    throw error instanceof Error ? error : new Error('Failed to fetch current user')
  }
}

export { fetchCurrentUser, fetchPolicy, fetchTerms }
export type { GetPolicyResponse }
