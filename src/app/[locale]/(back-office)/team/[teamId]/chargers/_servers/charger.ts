"use client"

import { api } from '@/lib/api/config/axios'
import { API_ENDPOINTS } from '@/lib/constants'

import type {
  ChargerBrandsResponse,
  ChargerDetailResponse,
  ChargerListResponse,
  ChargerTypeResponse,
  ChargingStationsResponse,
  CheckConnectionResponse,
  CreateChargerRequest,
  CreateChargerResponse,
  DeleteChargerResponse,
  UpdateSerialNumberRequest,
  UpdateSerialNumberResponse,
} from '../_schemas/chargers.schema'
import {
  ChargerBrandsResponseSchema,
  ChargerDetailResponseSchema,
  ChargerListResponseSchema,
  ChargerTypeResponseSchema,
  ChargingStationsResponseSchema,
  CheckConnectionResponseSchema,
  CreateChargerRequestSchema,
  CreateChargerResponseSchema,
  DeleteChargerResponseSchema,
  UpdateSerialNumberRequestSchema,
  UpdateSerialNumberResponseSchema,
} from '../_schemas/chargers.schema'

export const getChargerBrands = async (): Promise<ChargerBrandsResponse> => {
  try {
    const response = await api.get(API_ENDPOINTS.CHARGER.BRANDS)
    return ChargerBrandsResponseSchema.parse(response)
  } catch (error) {
    console.error('Error fetching charger brands:', error)
    throw new Error('Failed to fetch charger brands')
  }
}

export const getTeamChargingStations = async (
  teamGroupId: string,
): Promise<ChargingStationsResponse> => {
  const url = `${API_ENDPOINTS.STATION.TEAM_STATIONS}/${teamGroupId}`
  const response = await api.get(url)
  return ChargingStationsResponseSchema.parse(response)
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
    const response = await api.get(url)
    return ChargerListResponseSchema.parse(response)
  } catch (error) {
    console.error('Error fetching chargers list:', error)
    throw new Error('Failed to fetch chargers list')
  }
}

export const checkConnection = async (
  chargerCode: string,
): Promise<CheckConnectionResponse> => {
  const url = `${API_ENDPOINTS.CHARGER.CHECK_CONNECTION}/${chargerCode}`
  const response = await api.get(url)
  return CheckConnectionResponseSchema.parse(response)
}

export const createCharger = async (
  teamGroupId: string,
  chargerData: CreateChargerRequest,
): Promise<CreateChargerResponse> => {
  const url = `${API_ENDPOINTS.CHARGER.CREATE}?team_group_id=${teamGroupId}`
  const payload = CreateChargerRequestSchema.parse(chargerData)
  const response = await api.post(url, payload)
  return CreateChargerResponseSchema.parse(response)
}

export const updateCharger = async (
  teamGroupId: string,
  chargerId: number,
  chargerData: CreateChargerRequest,
): Promise<CreateChargerResponse> => {
  const url = `${API_ENDPOINTS.CHARGER.UPDATE}/${chargerId}?team_group_id=${teamGroupId}`
  const payload = CreateChargerRequestSchema.parse(chargerData)
  const response = await api.patch(url, payload)
  return CreateChargerResponseSchema.parse(response)
}

export const updateSerialNumber = async (
  serialData: UpdateSerialNumberRequest,
): Promise<UpdateSerialNumberResponse> => {
  const payload = UpdateSerialNumberRequestSchema.parse(serialData)
  const response = await api.put(
    API_ENDPOINTS.CHARGER.UPDATE_SERIAL,
    payload,
  )
  return UpdateSerialNumberResponseSchema.parse(response)
}

export const deleteCharger = async (
  chargerId: number | string,
): Promise<DeleteChargerResponse> => {
  const url = `${API_ENDPOINTS.CHARGER.DELETE}/${chargerId}`
  const response = await api.delete(url)
  return DeleteChargerResponseSchema.parse(response)
}

export const getChargerTypes = async (): Promise<ChargerTypeResponse> => {
  const response = await api.get(API_ENDPOINTS.CHARGER.CHARGER_TYPES)
  return ChargerTypeResponseSchema.parse(response)
}

export const getChargerDetail = async (
  chargerId: number | string,
): Promise<ChargerDetailResponse> => {
  const url = `${API_ENDPOINTS.CHARGER.CHARGER_DETAIL}${chargerId}`
  const response = await api.get(url)
  return ChargerDetailResponseSchema.parse(response)
}
