import { api } from '@/lib/api/config/axios-client'
import { API_ENDPOINTS } from '@/lib/constants'

import {
  PriceGroup,
  PriceGroupDetailResponse,
  PriceGroupDetailResponseSchema,
  PriceSetResponse,
  PriceSetResponseSchema,
  PriceSetType,
  PriceSetTypeSchema,
} from '../_schemas'

const logApiError = (action: string, error: unknown, context: Record<string, unknown>) => {
  console.error(action, {
    error,
    ...context,
    timestamp: new Date().toISOString(),
    errorMessage: error instanceof Error ? error.message : 'Unknown error',
    errorStack: error instanceof Error ? error.stack : undefined,
  })
}

const normalizePriceGroup = (priceGroup: PriceGroup) => ({
  ...priceGroup,
  minute_fee: priceGroup.minute_fee
    ? {
        ...priceGroup.minute_fee,
        apply_fee_after_minute:
          priceGroup.minute_fee.apply_fee_after_minute === null
            ? undefined
            : priceGroup.minute_fee.apply_fee_after_minute,
        fee_stops_after_minute:
          priceGroup.minute_fee.fee_stops_after_minute === null
            ? undefined
            : priceGroup.minute_fee.fee_stops_after_minute,
      }
    : priceGroup.minute_fee,
})

const fetchPriceSet = async (
  type?: PriceSetType,
  page: number = 1,
  pageSize: number = 10,
  teamGroupId?: string | number | null,
): Promise<PriceSetResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (type) {
      queryParams.append('type', PriceSetTypeSchema.parse(type))
    }

    if (teamGroupId !== undefined && teamGroupId !== null) {
      queryParams.append('team_group_id', String(teamGroupId))
    }

    const url = `${API_ENDPOINTS.SET_PRICE.LIST}?${queryParams.toString()}`
    const response = await api.get(url)
    const raw = response.data

    const refined = (() => {
      if (Array.isArray(raw)) {
        return {
          statusCode: 200,
          data: {
            data: raw.map(normalizePriceGroup),
            count: raw.length,
          },
        }
      }

      if (Array.isArray(raw?.data?.data)) {
        return {
          ...raw,
          data: {
            ...raw.data,
            data: raw.data.data.map(normalizePriceGroup),
          },
        }
      }

      if (Array.isArray(raw?.data)) {
        return {
          ...raw,
          data: {
            data: raw.data.map(normalizePriceGroup),
            count: raw.data.length,
          },
        }
      }

      return raw
    })()

    return PriceSetResponseSchema.parse(refined)
  } catch (error) {
    logApiError('Failed to fetch price set', error, { type, page, pageSize, teamGroupId })
    if (error instanceof Error) {
      throw new Error(`Failed to fetch price set: ${error.message}`)
    }
    throw new Error('Failed to fetch price set: unknown error')
  }
}

const fetchPriceSetById = async (priceId: string): Promise<PriceGroupDetailResponse> => {
  try {
    const url = `${API_ENDPOINTS.SET_PRICE.DETAIL}/${priceId}`
    const response = await api.get(url)
    const raw = response.data
    const refined =
      raw && typeof raw === 'object' && 'statusCode' in raw
        ? raw
        : {
            statusCode: 200,
            data: raw ?? null,
            message: 'Request successful',
          }
    const parsed = PriceGroupDetailResponseSchema.parse(refined)

    if (parsed.statusCode !== undefined && parsed.statusCode !== 200) {
      throw new Error(parsed.message || 'Failed to fetch price set detail')
    }

    return parsed
  } catch (error) {
    logApiError('Failed to fetch price set detail', error, { priceId })
    if (error instanceof Error) {
      throw new Error(`Failed to fetch price set detail: ${error.message}`)
    }
    throw new Error('Failed to fetch price set detail: unknown error')
  }
}

export { fetchPriceSet, fetchPriceSetById }
export type { PriceGroup, PriceGroupDetailResponse, PriceSetResponse }
