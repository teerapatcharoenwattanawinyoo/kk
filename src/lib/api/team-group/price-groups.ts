import { API_ENDPOINTS } from '@/lib/constants'
import { api } from '../config/axios'

export interface CreateByParentRequest {
  parent_id: number
  plug_id: number[]
}

export interface CreateByParentResponse {
  statusCode: number
  data: {
    success: boolean
    message?: string
  }
  message: string
}

export interface StartingFee {
  id: number
  team_group_price_set_id: number
  description: string
  fee: string
}

export interface ChargingFee {
  id: number
  team_group_price_set_id: number
  description: string
  fee_price: string
  apply_after_minute: number
}

export interface MinuteFee {
  id: number
  team_group_price_set_id: number
  description: string
  fee_per_min: string
  apply_fee_after_minute: number
  fee_stops_after_minute: number
}

export interface IdleFee {
  id: number
  team_group_price_set_id: number
  description: string
  fee_per_min: string
  time_before_idle_fee_applied: number
  max_total_idle_fee: number | null
}

export interface PriceGroup {
  id: number
  team_group_id: number | null
  customer_id: number | null
  plug_id: number | null
  charger_id: number | null
  station_id: number | null
  type: string
  price_per_kwh: string
  price_per_minute: string
  price_on_peak: string
  price_off_peak: string
  team_host_id: number
  parent_id: number | null
  name: string
  starting_fee: StartingFee | null
  charging_fee: ChargingFee | null
  minute_fee: MinuteFee | null
  idle_fee: IdleFee | null
}

export interface PriceSetData {
  data: PriceGroup[]
  count: number
}

export interface PriceSetResponse {
  statusCode: number
  data: PriceSetData
  message: string
}

export interface UpdatePriceRequest extends Partial<CreatePriceRequest> {
  team_group_id?: number
  status_type?: 'GENERAL' | 'MEMBER'
}

export interface UpdatePriceResponse {
  statusCode: number
  data: {
    success: boolean
    message?: string
  }
  message: string
}

export interface CreatePriceRequest {
  type: 'PER_KWH' | 'PER_MINUTE' | 'PEAK'
  price_per_kwh?: number
  price_per_minute?: number
  price_on_peak?: number
  price_off_peak?: number
  team_group_id: number
  name: string
  status_type?: 'GENERAL' | 'MEMBER'
  starting_fee?: {
    description: string
    fee: string
  }
  charging_fee?: {
    description: string
    feePrice: string
    apply_after_minute: number
  }
  minute_fee?: {
    description: string
    feePerMin: string
    apply_fee_after_minute: number
    fee_stops_after_minute?: number
  }
  idle_fee?: {
    description: string
    feePerMin: string
    time_before_idle_fee_applied: number
    max_total_idle_fee?: number
  }
}

export interface CreatePriceResponse {
  statusCode: number
  data: {
    success: boolean
    message?: string
    id?: number
  }
  message: string
}

export async function getPriceSet(
  type?: 'general' | 'member',
  page: number = 1,
  pageSize: number = 10,
): Promise<PriceSetResponse> {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    // Add type parameter if provided
    if (type) {
      queryParams.append('type', type)
    }

    const url = `${API_ENDPOINTS.SET_PRICE.LIST}?${queryParams.toString()}`

    const response = await api.get<PriceSetResponse>(url)

    return response
  } catch (error) {
    // Enhanced error logging to capture more details
    console.error('Error fetching price set:', {
      error,
      type,
      page,
      pageSize,
      timestamp: new Date().toISOString(),
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    })

    // Re-throw with more context for better debugging
    if (error instanceof Error) {
      throw new Error(`Failed to fetch price set: ${error.message}`)
    }
    throw new Error('Failed to fetch price set: unknown error')
  }
}

export async function createPriceSetByParent(
  requestData: CreateByParentRequest,
): Promise<CreateByParentResponse> {
  try {
    console.log('Create Price Set by Parent API Request:', {
      requestData,
      url: API_ENDPOINTS.SET_PRICE.CREATE_BY_PARENT,
    })

    const response = await api.post<CreateByParentResponse>(
      API_ENDPOINTS.SET_PRICE.CREATE_BY_PARENT,
      requestData,
    )

    console.log('Create Price Set by Parent API Response:', {
      statusCode: response.statusCode,
      message: response.message,
      data: response.data,
    })

    return response
  } catch (error) {
    console.error(' Error creating price set by parent:', {
      error,
      requestData,
      timestamp: new Date().toISOString(),
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    })

    if (error instanceof Error) {
      throw new Error(`Failed to create price set by parent: ${error.message}`)
    }
    throw new Error('Failed to create price set by parent: unknown error')
  }
}

export async function createPriceSet(
  requestData: CreatePriceRequest,
): Promise<CreatePriceResponse> {
  try {
    console.log('Create Price Set API Request:', {
      requestData,
      url: API_ENDPOINTS.SET_PRICE.CREATE_PRICE,
    })

    const response = await api.post<CreatePriceResponse>(
      API_ENDPOINTS.SET_PRICE.CREATE_PRICE,
      requestData,
    )

    console.log('Create Price Set API Response:', {
      statusCode: response.statusCode,
      message: response.message,
      data: response.data,
    })

    return response
  } catch (error) {
    console.error('Error creating price set:', {
      error,
      requestData,
      timestamp: new Date().toISOString(),
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    })

    if (error instanceof Error) {
      throw new Error(`Failed to create price set: ${error.message}`)
    }
    throw new Error('Failed to create price set: unknown error')
  }
}

export async function updatePriceSet(
  priceId: string,
  requestData: UpdatePriceRequest,
): Promise<UpdatePriceResponse> {
  try {
    const url = `${API_ENDPOINTS.SET_PRICE.UPDATE}/${priceId}`
    const response = await api.put<UpdatePriceResponse>(url, requestData)
    console.log('Update Price Set API Response:', {
      statusCode: response.statusCode,
      message: response.message,
      data: response.data,
      timestamp: new Date().toISOString(),
    })
    if (response.statusCode !== 200) {
      throw new Error(`Failed to update price set: ${response.message || 'Unknown error'}`)
    }
    return response
  } catch (error) {
    console.error('Error updating price set:', {
      error,
      priceId,
      requestData,
      timestamp: new Date().toISOString(),
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    })
    if (error instanceof Error) {
      throw new Error(`Failed to update price set: ${error.message}`)
    }
    throw new Error('Failed to update price set: unknown error')
  }
}
