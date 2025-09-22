import { getAuthTokens } from '@/lib/auth/tokens'
import { API_ENDPOINTS } from '@/lib/constants'
import { api } from '../config/axios'

export interface ChargerModel {
  id: number
  brand_id: number
  model_name: string
  power_levels: string
}

export interface ChargerBrand {
  id: number
  brand_name: string
  models: ChargerModel[]
}

export interface ChargerBrandsResponse {
  statusCode: number
  data: ChargerBrand[]
  message: string
}

export interface ChargingStation {
  id: string
  station_name: string
  station_detail: string
  address: string
  status: number
  created_at: string
  team_group_id: number
  chargers: number
  team: string
  aceesibility: string
  gallery: string
  date: string
  time: string
}

export interface ChargingStationsData {
  page_current: string
  page_total: number
  page_size: string
  item_total: number
  data: ChargingStation[]
}

export interface ChargingStationsResponse {
  statusCode: number
  data: ChargingStationsData
  message: string
}

export interface CreateChargerRequest {
  partner_id: string
  station_id: number
  team_group_id: number
  charger_name: string
  charger_access: string
  max_kwh: string
  charger_type_id: number
  brand: number
  model: number
}

export interface EditChargerInitialValues {
  id?: string
  chargerName?: string
  chargerAccess?: string
  selectedBrand?: string
  selectedModel?: string
  typeConnector?: string
  selectedPowerLevel?: string
  selectedChargingStation?: string
  serialNumber?: string
  selectedTeam?: string
}
export interface ChargerDetailResponse {
  statusCode: number
  data: {
    id: number
    name: string
    serial_number: string | null
    image: string | null
    station_id: string
    station_name: string
    team_group_id: number
    team: string
    charger_type_id: number
    charger_type: string
    brand_id: number
    brand: string
    model_id: number
    model: string
    max_power: string | null
    aceesibility: string
    status: string | null
    connection: string
    date: string | null
    time: string | null
  }
  message: string
}
export interface CreateChargerResponse {
  statusCode: number
  data: {
    data: {
      id: number
      [key: string]: unknown
    }
    message?: string
    [key: string]: unknown
  }
  message: string
}

export interface UpdateSerialNumberRequest {
  charger_code: string
  charger_id: number
}

export interface UpdateSerialNumberResponse {
  statusCode: number
  data: {
    success: boolean
    charger_id: number
  }
  message: string
}

export interface CheckConnectionResponse {
  statusCode: number
  data: {
    status: string
    connected: boolean
  }
  message: string
}

export interface ChargerListItem {
  id: number
  name: string
  serial_number: string | null
  image: string | null
  station_id: number
  station_name: string
  team: string
  charger_access: string
  model_id: number
  model_name: string
  brand_name: string
  brand_id: number
  power_levels: string
  max_kwh: string
  type_connector: string
  charger_code: string
  power_level: string
  accessibility: string
  status: string

  connection: string
  date: string
  time: string
}

export interface ChargerListData {
  page: string
  page_total: number
  page_size: string
  item_total: number
  data: ChargerListItem[]
}

export interface ChargerListResponse {
  statusCode: number
  data: ChargerListData
  message: string
}

export interface ChargerType {
  id: number
  name: string
  plug_type: string
  icon_plug_type: string
  max_output: string
  slug: string
  sort_order: number
}

export interface ChargerTypeResponse {
  statusCode: number
  data: ChargerType[]
  message: string
}

export const getChargerBrands = async (): Promise<ChargerBrandsResponse> => {
  try {
    const response = await api.get<ChargerBrandsResponse>(API_ENDPOINTS.CHARGER.BRANDS)
    return response
  } catch (error) {
    console.error('Error fetching charger brands:', error)
    throw new Error('Failed to fetch charger brands')
  }
}

export const getTeamChargingStations = async (
  teamGroupId: string,
): Promise<ChargingStationsResponse> => {
  const { accessToken } = getAuthTokens()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.STATION.TEAM_STATIONS}/${teamGroupId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'lang-id': '1',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch team charging stations')
  }

  return response.json()
}

export const getChargersList = async (
  teamGroupId: string,
  page: number = 1,
  pageSize: number = 10,
  station_id?: number,
  search?: string,
  status?: string,
): Promise<ChargerListResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search && search.trim()) {
      queryParams.set('search', search.trim())
    }
    if (status && status.trim()) {
      queryParams.set('status', status.trim())
    }
    if (typeof station_id === 'number' && !Number.isNaN(station_id)) {
      queryParams.set('station_id', station_id.toString())
    }

    const url = `${API_ENDPOINTS.CHARGER.LIST}/${teamGroupId}?${queryParams.toString()}`

    const response = await api.get<ChargerListResponse>(url)

    return response
  } catch (error) {
    console.error('Error fetching chargers list:', error)
    throw new Error('Failed to fetch chargers list')
  }
}
export const checkConnection = async (chargerCode: string): Promise<CheckConnectionResponse> => {
  const { accessToken } = getAuthTokens()

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.CHARGER.CHECK_CONNECTION}/${chargerCode}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'lang-id': '1',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  })

  if (!response.ok) {
    throw new Error('Failed to check connection')
  }

  return response.json()
}
export const createCharger = async (
  teamGroupId: string,
  chargerData: CreateChargerRequest,
): Promise<CreateChargerResponse> => {
  const { accessToken } = getAuthTokens()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.CHARGER.CREATE}?team_group_id=${teamGroupId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'lang-id': '1',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify(chargerData),
    },
  )

  let responseData: unknown = null

  try {
    responseData = await response.json()
  } catch (error) {
    console.error('Failed to parse createCharger response JSON:', error)
  }

  if (!response.ok) {
    const errorMessage =
      responseData &&
      typeof responseData === 'object' &&
      'message' in responseData &&
      typeof (responseData as { message?: unknown }).message === 'string'
        ? ((responseData as { message?: string }).message as string)
        : 'Failed to create charger'

    throw new Error(errorMessage)
  }

  if (responseData && typeof responseData === 'object') {
    const responseRecord = responseData as CreateChargerResponse & Record<string, unknown>

    const candidateStatus = [
      responseRecord.statusCode,
      responseRecord.status,
      responseRecord.code,
    ] as Array<number | string | undefined>

    const normalizedStatus = candidateStatus.reduce<number | undefined>((acc, current) => {
      if (typeof acc === 'number') {
        return acc
      }

      if (typeof current === 'number') {
        return current
      }

      if (typeof current === 'string') {
        const parsed = Number.parseInt(current, 10)
        if (!Number.isNaN(parsed)) {
          return parsed
        }
      }

      return acc
    }, undefined)

    return {
      ...responseRecord,
      statusCode: normalizedStatus ?? response.status,
    }
  }

  throw new Error('Invalid response received while creating charger')
}

export const updateCharger = async (
  teamGroupId: string,
  chargerId: number,
  chargerData: CreateChargerRequest,
): Promise<CreateChargerResponse> => {
  const { accessToken } = getAuthTokens()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.CHARGER.UPDATE}/${chargerId}?team_group_id=${teamGroupId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'lang-id': '1',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify(chargerData),
    },
  )

  if (!response.ok) {
    throw new Error('Failed to update charger')
  }

  return response.json()
}

export const updateSerialNumber = async (
  serialData: UpdateSerialNumberRequest,
): Promise<UpdateSerialNumberResponse> => {
  const { accessToken } = getAuthTokens()

  // Validate input data
  if (!serialData.charger_code || !serialData.charger_id) {
    throw new Error('Both charger_code and charger_id are required')
  }

  console.log('🔥 updateSerialNumber called with:', serialData)
  console.log(
    '🔥 Request URL:',
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.CHARGER.UPDATE_SERIAL}`,
  )
  console.log('🔥 Request body:', JSON.stringify(serialData))

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.CHARGER.UPDATE_SERIAL}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'lang-id': '1',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify(serialData),
    },
  )

  console.log('🔥 Response status:', response.status)
  console.log('🔥 Response ok:', response.ok)

  if (!response.ok) {
    const errorData = await response.json()
    console.log('🔥 Error response:', errorData)
    throw new Error(`Failed to update serial number: ${errorData.message || 'Unknown error'}`)
  }

  const responseData = await response.json()
  console.log('🔥 Success response:', responseData)
  return responseData
}

export const deleteCharger = async (
  chargerId: number | string,
): Promise<{ statusCode: number; message: string }> => {
  const { accessToken } = getAuthTokens()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.CHARGER.DELETE}/${chargerId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'lang-id': '1',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    },
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to delete charger: ${errorData.message || 'Unknown error'}`)
  }

  return response.json()
}

export const getChargerTypes = async (): Promise<ChargerTypeResponse> => {
  const { accessToken } = getAuthTokens()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.CHARGER.CHARGER_TYPES}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'lang-id': '1',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch charger types')
  }

  return response.json()
}

export const getChargerDetail = async (
  chargerId: number | string,
): Promise<ChargerDetailResponse> => {
  const { accessToken } = getAuthTokens()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.CHARGER.CHARGER_DETAIL}${chargerId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'lang-id': '1',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch charger detail')
  }

  return response.json()
}
