'use client'
import { api } from '@/lib/api/config/axios-client'
import { API_ENDPOINTS } from '@/lib/constants'

import type {
  ConnectorChargerListResponse,
  ConnectorData,
  ConnectorDetailResponse,
  ConnectorListData,
  ConnectorListItem,
  ConnectorListResponse,
  ConnectorSelectItem,
  ConnectorType,
  ConnectorTypeListResponse,
  CreateConnectorRequest,
  CreateConnectorResponse,
  DeleteConnectorResponse,
  UpdateConnectorRequest,
  UpdateConnectorResponse,
} from '../_schemas/connector.schema'
import {
  ConnectorChargerListResponseSchema,
  ConnectorDetailResponseSchema,
  ConnectorListResponseSchema,
  ConnectorTypeListResponseSchema,
  CreateConnectorRequestSchema,
  CreateConnectorResponseSchema,
  DeleteConnectorResponseSchema,
  UpdateConnectorRequestSchema,
  UpdateConnectorResponseSchema,
} from '../_schemas/connector.schema'

export type {
  ConnectorChargerListResponse,
  ConnectorData,
  ConnectorDetailResponse,
  ConnectorListData,
  ConnectorListItem,
  ConnectorListResponse,
  ConnectorSelectItem,
  ConnectorType,
  ConnectorTypeListResponse,
  CreateConnectorRequest,
  CreateConnectorResponse,
  DeleteConnectorResponse,
  UpdateConnectorRequest,
  UpdateConnectorResponse,
} from '../_schemas/connector.schema'

export const getConnectorList = async (
  teamGroupId: number | string,
  searchTerm?: string,
  charger_id?: number,
): Promise<ConnectorChargerListResponse> => {
  try {
    const params = new URLSearchParams()

    if (searchTerm) {
      params.append('search', searchTerm)
    }
    if (charger_id) {
      params.append('charger_id', charger_id.toString())
    }

    const endpoint = `${API_ENDPOINTS.CONNECTOR.LIST}/${teamGroupId}${params.toString() ? `?${params.toString()}` : ''}`
    const response = await api.get(endpoint)
    return ConnectorChargerListResponseSchema.parse(response)
  } catch (error) {
    console.error('Error fetching connector list:', error)
    throw error
  }
}

export const getChargerTypes = async (): Promise<ConnectorTypeListResponse> => {
  try {
    const response = await api.get(API_ENDPOINTS.CONNECTOR.TYPE_LIST)
    return ConnectorTypeListResponseSchema.parse(response)
  } catch (error) {
    console.error('Error fetching charger types:', error)
    throw new Error('Failed to fetch charger types')
  }
}

export const getConnectorsList = async (
  teamGroupId: string | number,
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

    if (search && search.trim()) {
      queryParams.set('search', search.trim())
    }

    if (status && status.trim()) {
      queryParams.set('status', status.trim())
    }

    if (typeof chargerId === 'number' && !Number.isNaN(chargerId)) {
      queryParams.set('charger_id', chargerId.toString())
    }

    const url = `${API_ENDPOINTS.CONNECTOR.LIST}/${teamGroupId}?${queryParams.toString()}`
    const response = await api.get(url)
    return ConnectorListResponseSchema.parse(response)
  } catch (error) {
    console.error('Error fetching connectors list:', error)
    throw new Error('Failed to fetch connectors list')
  }
}

export const getConnectorDetail = async (
  connectorId: string | number,
): Promise<ConnectorDetailResponse> => {
  try {
    const url = `${API_ENDPOINTS.CONNECTOR.DETAIL}/${connectorId}`
    const response = await api.get(url)
    return ConnectorDetailResponseSchema.parse(response)
  } catch (error) {
    console.error('Error fetching connector detail:', error)
    throw new Error('Failed to fetch connector detail')
  }
}

export const createConnector = async (
  requestData: CreateConnectorRequest,
): Promise<CreateConnectorResponse> => {
  try {
    const payload = CreateConnectorRequestSchema.parse(requestData)
    const response = await api.post(API_ENDPOINTS.CONNECTOR.CREATE, payload)
    return CreateConnectorResponseSchema.parse(response)
  } catch (error) {
    console.error('Error creating connector:', error)
    throw new Error('Failed to create connector')
  }
}

export const updateConnector = async (
  connectorId: number | string,
  requestData: UpdateConnectorRequest,
): Promise<UpdateConnectorResponse> => {
  try {
    const payload = UpdateConnectorRequestSchema.parse(requestData)
    const response = await api.patch(`${API_ENDPOINTS.CONNECTOR.UPDATE}${connectorId}`, payload)
    return UpdateConnectorResponseSchema.parse(response)
  } catch (error) {
    console.error('Error updating connector:', error)
    throw new Error('Failed to update connector')
  }
}

export const deleteConnector = async (
  connectorId: number | string,
): Promise<DeleteConnectorResponse> => {
  try {
    const response = await api.delete(`${API_ENDPOINTS.CONNECTOR.DELETE}/${connectorId}`)
    return DeleteConnectorResponseSchema.parse(response)
  } catch (error) {
    console.error('Error deleting connector:', error)
    throw new Error('Failed to delete connector')
  }
}

export type Charger = ConnectorSelectItem
