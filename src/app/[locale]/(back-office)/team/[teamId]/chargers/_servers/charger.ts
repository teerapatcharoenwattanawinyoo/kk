'use client'

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
import type { z } from 'zod'

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

const toString = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return undefined
}

const toBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    if (Number.isNaN(value)) {
      return undefined
    }

    if (value === 1) return true
    if (value === 0) return false
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()

    if (!normalized) {
      return undefined
    }

    const truthyValues = [
      'true',
      '1',
      'yes',
      'y',
      'connected',
      'success',
      'succeeded',
      'online',
      'paired',
      'pairing success',
    ]

    if (truthyValues.includes(normalized)) {
      return true
    }

    const falsyValues = [
      'false',
      '0',
      'no',
      'n',
      'disconnected',
      'failed',
      'failure',
      'offline',
      'pairing failed',
      'pairing failure',
    ]

    if (falsyValues.includes(normalized)) {
      return false
    }
  }

  return undefined
}

<<<<<<< HEAD
const tryParseJson = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return value
  }

  const startsLikeJson =
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))

  if (!startsLikeJson) {
    return value
  }

  try {
    return JSON.parse(trimmed)
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Failed to parse JSON while normalizing checkConnection response', {
        rawValue: value,
        error,
      })
    }

    return value
  }
}

=======
>>>>>>> bug
const normalizeCheckConnectionResponse = (
  rawResponse: unknown,
  parseError: z.ZodError<CheckConnectionResponse>,
): CheckConnectionResponse => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('checkConnection response did not match schema', {
      issues: parseError.issues,
      rawResponse,
    })
  }

<<<<<<< HEAD
  const normalizedRaw = tryParseJson(rawResponse)

  const responseLike =
    (typeof normalizedRaw === 'object' && normalizedRaw !== null
      ? normalizedRaw
      : {}) as {
      statusCode?: unknown
      status?: unknown
      status_code?: unknown
      code?: unknown
      httpStatus?: unknown
      http_code?: unknown
      message?: unknown
      statusMessage?: unknown
      data?: unknown
    }
=======
  const responseLike = rawResponse as {
    statusCode?: unknown
    status?: unknown
    status_code?: unknown
    code?: unknown
    httpStatus?: unknown
    http_code?: unknown
    message?: unknown
    statusMessage?: unknown
    data?: unknown
  }
>>>>>>> bug

  const statusCodeCandidates: unknown[] = [
    responseLike.statusCode,
    responseLike.status,
    responseLike.status_code,
    responseLike.code,
    responseLike.httpStatus,
    responseLike.http_code,
  ]

  let resolvedStatusCode = 200

  for (const candidate of statusCodeCandidates) {
    const parsed = toNumber(candidate)
    if (typeof parsed === 'number') {
      resolvedStatusCode = parsed
      break
    }
  }

  const messageCandidates: unknown[] = [
    responseLike.message,
    responseLike.statusMessage,
    responseLike.status,
  ]

<<<<<<< HEAD
  if (typeof normalizedRaw === 'string') {
    messageCandidates.push(normalizedRaw)
  }

=======
>>>>>>> bug
  let resolvedMessage = ''
  for (const candidate of messageCandidates) {
    const parsed = toString(candidate)
    if (parsed) {
      resolvedMessage = parsed
      break
    }
  }

<<<<<<< HEAD
  const dataLike = tryParseJson(
    responseLike.data !== undefined ? responseLike.data : normalizedRaw,
  )
=======
  const dataLike = responseLike.data
>>>>>>> bug

  let resolvedStatus = ''
  let resolvedConnected: boolean | undefined

  const applyStatus = (candidate: unknown) => {
    if (resolvedStatus) {
      return
    }

    const parsed = toString(candidate)
    if (parsed) {
      resolvedStatus = parsed
    }
  }

  const applyConnected = (candidate: unknown) => {
    if (typeof resolvedConnected === 'boolean') {
      return
    }

    const parsed = toBoolean(candidate)
    if (typeof parsed === 'boolean') {
      resolvedConnected = parsed
    }
  }

  if (typeof dataLike === 'string') {
    applyStatus(dataLike)
    applyConnected(dataLike)
  } else if (Array.isArray(dataLike)) {
<<<<<<< HEAD
    for (const rawEntry of dataLike) {
      const entry = tryParseJson(rawEntry)

=======
    for (const entry of dataLike) {
>>>>>>> bug
      if (typeof entry === 'object' && entry !== null) {
        applyStatus((entry as { status?: unknown }).status)
        applyStatus((entry as { detail?: unknown }).detail)
        applyStatus((entry as { message?: unknown }).message)
        applyConnected((entry as { connected?: unknown }).connected)
        applyConnected((entry as { online?: unknown }).online)
        applyConnected((entry as { isConnected?: unknown }).isConnected)
        applyConnected((entry as { is_online?: unknown }).is_online)
      } else {
        applyStatus(entry)
        applyConnected(entry)
      }

      if (resolvedStatus && typeof resolvedConnected === 'boolean') {
        break
      }
    }
  } else if (typeof dataLike === 'object' && dataLike !== null) {
    const dataObject = dataLike as {
      status?: unknown
      detail?: unknown
      message?: unknown
      description?: unknown
      connected?: unknown
      isConnected?: unknown
      is_connected?: unknown
      online?: unknown
      isOnline?: unknown
      result?: unknown
    }

    applyStatus(dataObject.status)
    applyStatus(dataObject.detail)
    applyStatus(dataObject.message)
    applyStatus(dataObject.description)
    applyStatus(dataObject.result)

    applyConnected(dataObject.connected)
    applyConnected(dataObject.isConnected)
    applyConnected(dataObject.is_connected)
    applyConnected(dataObject.online)
    applyConnected(dataObject.isOnline)

<<<<<<< HEAD
    const normalizedResult = tryParseJson(dataObject.result)

    if (
      typeof normalizedResult === 'object' &&
      normalizedResult !== null &&
      'status' in (normalizedResult as Record<string, unknown>)
    ) {
      const nested = normalizedResult as {
=======
    if (
      typeof dataObject.result === 'object' &&
      dataObject.result !== null &&
      'status' in (dataObject.result as Record<string, unknown>)
    ) {
      const nested = dataObject.result as {
>>>>>>> bug
        status?: unknown
        connected?: unknown
        online?: unknown
      }

      applyStatus(nested.status)
      applyConnected(nested.connected)
      applyConnected(nested.online)
    }
  } else {
    applyStatus(dataLike)
    applyConnected(dataLike)
  }

  if (!resolvedStatus) {
    resolvedStatus = resolvedMessage || 'Unknown'
  }

  if (typeof resolvedConnected !== 'boolean') {
    resolvedConnected = toBoolean(resolvedStatus) ?? toBoolean(resolvedMessage) ?? false
  }

  if (!resolvedMessage) {
    resolvedMessage = resolvedStatus
  }

  return {
    statusCode: resolvedStatusCode,
    message: resolvedMessage,
    data: {
      status: resolvedStatus,
      connected: resolvedConnected,
    },
  }
}

const normalizeCreateChargerResponse = (
  rawResponse: unknown,
  parseError: z.ZodError<CreateChargerResponse>,
): CreateChargerResponse => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('createCharger response did not match schema', {
      issues: parseError.issues,
      rawResponse,
    })
  }

  const responseLike = rawResponse as {
    statusCode?: unknown
    status?: unknown
    status_code?: unknown
    code?: unknown
    httpStatus?: unknown
    http_code?: unknown
    message?: unknown
    statusMessage?: unknown
    data?: {
      message?: unknown
      status?: unknown
      data?: {
        id?: unknown
        charger_id?: unknown
        chargerId?: unknown
      }
      charger_id?: unknown
      chargerId?: unknown
      id?: unknown
    }
    charger_id?: unknown
    chargerId?: unknown
    id?: unknown
  }

  const statusCandidates: unknown[] = [
    responseLike.statusCode,
    responseLike.status,
    responseLike.status_code,
    responseLike.code,
    responseLike.httpStatus,
    responseLike.http_code,
  ]

  const messageCandidates: unknown[] = [
    responseLike.message,
    responseLike.statusMessage,
    responseLike.status,
    responseLike.data?.message,
    responseLike.data?.status,
  ]

  const idCandidates: unknown[] = [
    responseLike.data?.data?.id,
    responseLike.data?.data?.charger_id,
    responseLike.data?.data?.chargerId,
    responseLike.data?.charger_id,
    responseLike.data?.chargerId,
    responseLike.data?.id,
    responseLike.charger_id,
    responseLike.chargerId,
    responseLike.id,
  ]

  let resolvedId: number | undefined
  let rawIdCandidate: unknown

  for (const candidate of idCandidates) {
    if (candidate === undefined || candidate === null) continue

    if (rawIdCandidate === undefined) {
      rawIdCandidate = candidate
    }

    const numericCandidate = toNumber(candidate)
    if (numericCandidate !== undefined) {
      resolvedId = numericCandidate
      break
    }
  }

  let normalizedStatus: number | undefined
  for (const candidate of statusCandidates) {
    const parsed = toNumber(candidate)
    if (parsed !== undefined) {
      normalizedStatus = parsed
      break
    }
  }

  let normalizedMessage: string | undefined
  for (const candidate of messageCandidates) {
    const parsed = toString(candidate)
    if (parsed !== undefined && parsed.trim() !== '') {
      normalizedMessage = parsed
      break
    }
  }

  const normalizedResponse: {
    statusCode: number
    message: string
    data: {
      data: { id: number; charger_id?: unknown }
      message?: string
    }
  } = {
    statusCode: normalizedStatus ?? 200,
    message: normalizedMessage ?? '',
    data: {
      data: {
        id: resolvedId ?? 0,
      },
    },
  }

  const nestedMessage = toString(responseLike.data?.message)
  if (nestedMessage) {
    normalizedResponse.data.message = nestedMessage
  }

  if (resolvedId === undefined && rawIdCandidate !== undefined) {
    normalizedResponse.data.data.charger_id = rawIdCandidate
  }

  return normalizedResponse as CreateChargerResponse
}

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

export const checkConnection = async (chargerCode: string): Promise<CheckConnectionResponse> => {
  const url = `${API_ENDPOINTS.CHARGER.CHECK_CONNECTION}/${chargerCode}`
  const response = await api.get(url)
  const parsedResponse = CheckConnectionResponseSchema.safeParse(response)

  if (parsedResponse.success) {
    return parsedResponse.data
  }

  return normalizeCheckConnectionResponse(response, parsedResponse.error)
}

export const createCharger = async (
  teamGroupId: string,
  chargerData: CreateChargerRequest,
): Promise<CreateChargerResponse> => {
  const url = `${API_ENDPOINTS.CHARGER.CREATE}?team_group_id=${teamGroupId}`
  const payload = CreateChargerRequestSchema.parse(chargerData)
  const response = await api.post(url, payload)
  const parsedResponse = CreateChargerResponseSchema.safeParse(response)

  if (parsedResponse.success) {
    return parsedResponse.data
  }

  return normalizeCreateChargerResponse(response, parsedResponse.error)
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
  const response = await api.put(API_ENDPOINTS.CHARGER.UPDATE_SERIAL, payload)
  return UpdateSerialNumberResponseSchema.parse(response)
}

export const deleteCharger = async (chargerId: number | string): Promise<DeleteChargerResponse> => {
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
