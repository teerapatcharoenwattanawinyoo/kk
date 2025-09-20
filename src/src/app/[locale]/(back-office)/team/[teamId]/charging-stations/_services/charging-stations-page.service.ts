import {
  fetchChargingStationDetail,
} from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations/_api/charging-stations.api'
import {
  type ChargingStationsParams,
  type ChargingStationsResponse,
  type ChargingStationFormData,
  type ExtendedUpdateChargingStationRequest,
  type PartnerStationGalleryDetail,
  type WorkTime,
} from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations/_schemas'
import { convertStationDetailToFormData } from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations/_utils'
import { getPartnerIdFromStorage } from '@/lib/utils/user-storage'

export interface PaginationState {
  currentPage: number
  pageSize: number
  searchQuery: string
}

export interface ChargingStationFormWithWork extends ChargingStationFormData {
  work?: WorkTime[]
  images?: globalThis.File[]
  deletedImageIds?: number[]
}

export type ChargingStationFormWithGallery = ChargingStationFormData & {
  existingGallery: PartnerStationGalleryDetail[]
}

export function getInitialPaginationState(
  searchParams: Readonly<URLSearchParams> | URLSearchParams,
): PaginationState {
  const pageParam = searchParams.get('page')
  const pageSizeParam = searchParams.get('pageSize')
  const searchParam = searchParams.get('search')

  return {
    currentPage: pageParam ? Number.parseInt(pageParam, 10) || 1 : 1,
    pageSize: pageSizeParam ? Number.parseInt(pageSizeParam, 10) || 10 : 10,
    searchQuery: searchParam ?? '',
  }
}

export function buildChargingStationsQueryParams(
  teamGroupId: number,
  state: PaginationState,
): ChargingStationsParams {
  const params: ChargingStationsParams = {
    team_group_id: teamGroupId,
    page: state.currentPage,
    pageSize: state.pageSize,
  }

  if (state.searchQuery.trim()) {
    params.search = state.searchQuery.trim()
  }

  return params
}

export function buildUpdatedUrl(pathname: string, state: PaginationState): string {
  const params = new URLSearchParams()
  params.set('page', state.currentPage.toString())
  params.set('pageSize', state.pageSize.toString())

  if (state.searchQuery.trim()) {
    params.set('search', state.searchQuery.trim())
  }

  const queryString = params.toString()
  return queryString ? `${pathname}?${queryString}` : pathname
}

export function extractChargingStationsData(response?: ChargingStationsResponse | null) {
  return {
    list: response?.data?.data ?? [],
    totalItems: response?.data?.item_total ?? 0,
    totalPages: response?.data?.page_total ?? 1,
  }
}

export function formatStationDateTime(date: string, time: string) {
  return `${date}\n${time}`
}

export async function loadStationFormData(
  stationId: string | number,
): Promise<ChargingStationFormWithGallery> {
  const response = await fetchChargingStationDetail(stationId)
  const rawData = Array.isArray(response.data) ? response.data[0] : response.data

  const converted = convertStationDetailToFormData(rawData)
  const { existingGallery, ...formData } = converted

  return {
    ...formData,
    existingGallery,
  }
}

export function mapUpdatePayload(
  stationId: string | number,
  teamGroupId: number,
  data: ChargingStationFormWithWork,
): {
  stationId: string | number
  team_group_id: number
  data: ExtendedUpdateChargingStationRequest
} {
  const work: WorkTime[] = data.work ?? []

  const payload: ExtendedUpdateChargingStationRequest = {
    station_type_id: data.station_type_id,
    latitude: data.coordinates.lat.toString(),
    longtitude: data.coordinates.lng.toString(),
    station_name: data.station_name,
    station_name_th: data.station_name_th,
    station_name_lao: data.station_name_lao,
    station_detail: data.station_detail,
    station_detail_th: data.station_detail_th,
    station_detail_lao: data.station_detail_lao,
    status: data.status,
    show_on_map: data.show_on_map,
    address: data.address,
    contact: data.contact,
    work,
    images: data.images,
    deletedImageIds: data.deletedImageIds,
  }

  return {
    stationId,
    team_group_id: teamGroupId,
    data: payload,
  }
}

export function ensurePartnerId(): string {
  const partnerId = getPartnerIdFromStorage()

  if (!partnerId) {
    throw new Error('Partner ID not found. Please log in again.')
  }

  return partnerId
}

