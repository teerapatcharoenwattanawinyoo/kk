import { api } from '@/lib/api/config/axios-client'
import { API_ENDPOINTS } from '@/lib/constants'

import {
  CreateByParentRequest,
  CreateByParentRequestSchema,
  CreateByParentResponse,
  CreateByParentResponseSchema,
  CreatePriceRequest,
  CreatePriceRequestSchema,
  CreatePriceResponse,
  CreatePriceResponseSchema,
  UpdatePriceRequest,
  UpdatePriceRequestSchema,
  UpdatePriceResponse,
  UpdatePriceResponseSchema,
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

const normalizeMutationResponse = <T extends object>(raw: unknown): T =>
  raw && typeof raw === 'object' && 'statusCode' in raw
    ? (raw as T)
    : ({
        statusCode: 200,
        data: raw,
        message: 'Request successful',
      } as T)

const applyPriceSetToParent = async (
  requestData: CreateByParentRequest,
): Promise<CreateByParentResponse> => {
  try {
    const payload = CreateByParentRequestSchema.parse(requestData)
    const response = await api.post(API_ENDPOINTS.SET_PRICE.CREATE_BY_PARENT, payload)
    return CreateByParentResponseSchema.parse(response.data)
  } catch (error) {
    logApiError('Failed to create price set by parent', error, { requestData })
    if (error instanceof Error) {
      throw new Error(`Failed to create price set by parent: ${error.message}`)
    }
    throw new Error('Failed to create price set by parent: unknown error')
  }
}

const createPriceSet = async (requestData: CreatePriceRequest): Promise<CreatePriceResponse> => {
  try {
    const payload = CreatePriceRequestSchema.parse(requestData)
    const response = await api.post(API_ENDPOINTS.SET_PRICE.CREATE_PRICE, payload)
    const refined = normalizeMutationResponse<CreatePriceResponse>(response.data)
    return CreatePriceResponseSchema.parse(refined)
  } catch (error) {
    logApiError('Failed to create price set', error, { requestData })
    if (error instanceof Error) {
      throw new Error(`Failed to create price set: ${error.message}`)
    }
    throw new Error('Failed to create price set: unknown error')
  }
}

const updatePriceSet = async (
  priceId: string,
  requestData: UpdatePriceRequest,
): Promise<UpdatePriceResponse> => {
  try {
    const payload = UpdatePriceRequestSchema.parse(requestData)
    const url = `${API_ENDPOINTS.SET_PRICE.UPDATE}/${priceId}`
    const response = await api.put(url, payload)
    const refined = normalizeMutationResponse<UpdatePriceResponse>(response.data)
    return UpdatePriceResponseSchema.parse(refined)
  } catch (error) {
    logApiError('Failed to update price set', error, { priceId, requestData })
    if (error instanceof Error) {
      throw new Error(`Failed to update price set: ${error.message}`)
    }
    throw new Error('Failed to update price set: unknown error')
  }
}

export { applyPriceSetToParent, createPriceSet, updatePriceSet }

export type {
  CreateByParentRequest,
  CreateByParentResponse,
  CreatePriceRequest,
  CreatePriceResponse,
  UpdatePriceRequest,
  UpdatePriceResponse,
}
