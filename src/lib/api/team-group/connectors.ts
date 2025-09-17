import { API_ENDPOINTS } from '@/lib/constants'
import { api } from '../config/axios'

export interface ChargerType {
  id: number
  name: string
  image: string | null
  sort_order: number
  status: number
  deleted_at: string | null
  created_at: string
  created_by: number
  updated_at: string
  updated_by: number | null
}

export interface ChargerTypeListResponse {
  statusCode: number
  data: ChargerType[]
  message: string
}

// Interfaces from list.ts
export interface Charger {
  id: number
  name: string
  serial_number: string | null
  image: string | null
  station_name: string
  team: string
  aceesibility: string
  status: string
  connection: string
  date: string
  time: string
}

export interface ConnectorChargerListResponse {
  statusCode: number
  data: {
    data: Charger[]
  }
  message: string
}

// Function from list.ts
export async function getConnectorList(
  teamGroupId: number,
  searchTerm?: string,
  charger_id?: number,
): Promise<ConnectorChargerListResponse> {
  try {
    // Build query parameters
    const params = new URLSearchParams()

    if (searchTerm) {
      params.append('search', searchTerm)
    }
    if (charger_id) {
      params.append('charger_id', charger_id.toString())
    }

    // Build endpoint with team_group_id as path parameter
    const endpoint = `${API_ENDPOINTS.CONNECTOR.LIST}/${teamGroupId}${params.toString() ? `?${params.toString()}` : ''}`

    const data = await api.get<ConnectorChargerListResponse>(endpoint)

    return data
  } catch (error) {
    console.error('Error fetching connector list:', error)
    throw error
  }
}

// Create Connector/Plug interfaces
export interface CreateConnectorRequest {
  charger_id: number
  charger_type_id: number
  connector_name: string
  connection_id: number
  connector_type: string
  power: string
}

export interface ConnectorData {
  cost_rate: string
  id: number
  charger_id: number
  charger_type_id: number
  connector_name: string
  connection_id: number
  power: string
  created_at: string
  created_by: number
  type: string
  updated_at: string
  type_description: string | null
  sort_order: number | null
  status: string | null
  deleted_at: string | null
  updated_by: number | null
  serial_number: string | null
  qrcode: string | null
  connector_status: string
  print_qrcode: string | null
  ocpp_id_tag: string | null
}

export interface CreateConnectorResponse {
  statusCode: number
  data: {
    message: string
    data: ConnectorData
  }
  message: string
}

export async function getChargerTypes(): Promise<ChargerTypeListResponse> {
  try {
    const response = await api.get<ChargerTypeListResponse>('/plug/type/list')
    return response
  } catch (error) {
    console.error('Error fetching charger types:', error)
    throw new Error('Failed to fetch charger types')
  }
}

export interface ChargerListItem {
  id: string
  name: string
  serial_number: string
  station_name: string
  // ...other fields as needed
}

export interface ChargersListResponse {
  statusCode: number
  data: {
    data: ChargerListItem[]
    page_total: number
    item_total: number
  }
  message: string
}

export const getChargersList = async (teamGroupId: string): Promise<ChargersListResponse> => {
  try {
    const url = `${API_ENDPOINTS.CHARGER.LIST}/${teamGroupId}`
    const response = await api.get<ChargersListResponse>(url)
    return response
  } catch (error) {
    console.error('Error fetching chargers list:', error)
    throw new Error('Failed to fetch chargers list')
  }
}

export interface ConnectorListItem {
  id: number
  name: string | null
  serial_number: string | null
  charger_id?: number
  type: string
  station_name: string
  qr: string | null
  pricing: string
  status: string
  date: string
  time: string
}

export interface ConnectorListResponse {
  statusCode: number
  data: {
    page: string
    page_total: number
    page_size: string
    item_total: number
    data: ConnectorListItem[]
  }
  message: string
}

export const getConnectorsList = async (
  teamGroupId: string,
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  status: string = '',
  chargerId?: number,
): Promise<ConnectorListResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    // Add search parameter if provided
    if (search && search.trim()) {
      queryParams.set('search', search.trim())
    }

    // Add status filter if provided
    if (status && status.trim()) {
      queryParams.set('status', status.trim())
    }

    // Add charger_id filter if provided
    if (typeof chargerId === 'number' && !Number.isNaN(chargerId)) {
      queryParams.set('charger_id', chargerId.toString())
    }

    const url = `/team-groups/charging/connector/list/${teamGroupId}?${queryParams.toString()}`

    const response = await api.get<ConnectorListResponse>(url)

    return response
  } catch (error) {
    console.error('Error fetching connectors list:', error)
    throw new Error('Failed to fetch connectors list')
  }
}

export interface ConnectorDetailResponse {
  statusCode: number
  data: ConnectorData
  message: string
}

export const getConnectorDetail = async (
  connectorId: string | number,
): Promise<ConnectorDetailResponse> => {
  try {
    const url = `${API_ENDPOINTS.CONNECTOR.DETAIL}/${connectorId}`

    const response = await api.get<ConnectorDetailResponse>(url)

    return response
  } catch (error) {
    console.error('Error fetching connector detail:', error)
    throw new Error('Failed to fetch connector detail')
  }
}

export async function createConnector(
  requestData: CreateConnectorRequest,
): Promise<CreateConnectorResponse> {
  try {
    const response = await api.post<CreateConnectorResponse>(
      API_ENDPOINTS.CONNECTOR.CREATE,
      requestData,
    )
    return response
  } catch (error) {
    console.error('Error creating connector:', error)
    throw new Error('Failed to create connector')
  }
}

export interface DeleteConnectorResponse {
  statusCode: number
  message: string
}

// Update Connector interfaces
export interface UpdateConnectorRequest {
  charger_id: number
  charger_type_id: number
  connector_name: string
  connection_id: number
  connector_type: string
  power: string
}

export interface UpdateConnectorResponse {
  statusCode: number
  data: {
    message: string
    data: ConnectorData
  }
  message: string
}

export async function updateConnector(
  connectorId: number | string,
  requestData: UpdateConnectorRequest,
): Promise<UpdateConnectorResponse> {
  try {
    const response = await api.patch<UpdateConnectorResponse>(
      `${API_ENDPOINTS.CONNECTOR.UPDATE}${connectorId}`,
      requestData,
    )
    return response
  } catch (error) {
    console.error('Error updating connector:', error)
    throw new Error('Failed to update connector')
  }
}

export const deleteConnector = async (
  connectorId: number | string,
): Promise<DeleteConnectorResponse> => {
  try {
    const response = await api.delete<DeleteConnectorResponse>(
      `${API_ENDPOINTS.CONNECTOR.DELETE}/${connectorId}`,
    )
    return response
  } catch (error) {
    console.error('Error deleting connector:', error)
    throw new Error('Failed to delete connector')
  }
}
