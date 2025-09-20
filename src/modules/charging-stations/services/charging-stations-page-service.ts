import { getPartnerIdFromStorage } from '@/lib/utils/user-storage'
import { getChargingStationDetail } from '@/modules/charging-stations/api'
import {
  convertStationDetailToFormData,
  formatStationDateTime,
} from '@/modules/charging-stations/services/charging-station-transformers'
import {
  type ChargingStationFormSubmission,
  type ChargingStationFormWithGallery,
  type ChargingStationsParams,
  type CreateChargingStationRequest,
  type ExtendedUpdateChargingStationRequest,
} from '@/modules/charging-stations/schemas/charging-stations.schema'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

export interface PaginationState {
  page: number
  pageSize: number
  searchQuery: string
}

export type SearchParamsLike = Pick<URLSearchParams, 'get'>

export interface RouterLike {
  replace: (href: string, options?: { scroll?: boolean }) => void
}

export class PartnerIdNotFoundError extends Error {
  constructor(message = 'Partner ID not found. Please log in again.') {
    super(message)
    this.name = 'PartnerIdNotFoundError'
  }
}

const toPositiveInteger = (value: string | null, fallback: number) => {
  if (!value) return fallback

  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed
}

const sanitizeSearchQuery = (value: string | null) => value?.trim() ?? ''

export function parsePaginationState(searchParams: SearchParamsLike): PaginationState {
  return {
    page: toPositiveInteger(searchParams.get('page'), DEFAULT_PAGE),
    pageSize: toPositiveInteger(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE),
    searchQuery: sanitizeSearchQuery(searchParams.get('search')),
  }
}

export function buildChargingStationsQueryParams(
  teamGroupId: number,
  pagination: PaginationState,
): ChargingStationsParams {
  const { page, pageSize, searchQuery } = pagination
  const params: ChargingStationsParams = {
    team_group_id: teamGroupId,
    page,
    pageSize,
  }

  if (searchQuery) {
    params.search = searchQuery
  }

  return params
}

const createPaginationSearchParams = (pagination: PaginationState) => {
  const params = new URLSearchParams()
  params.set('page', pagination.page.toString())
  params.set('pageSize', pagination.pageSize.toString())

  if (pagination.searchQuery) {
    params.set('search', pagination.searchQuery)
  }

  return params
}

export function syncPaginationWithRouter(
  router: RouterLike,
  pathname: string,
  pagination: PaginationState,
): void {
  if (!pathname) {
    return
  }

  const params = createPaginationSearchParams(pagination)
  const queryString = params.toString()
  const newUrl = queryString ? `${pathname}?${queryString}` : pathname

  if (typeof window !== 'undefined') {
    window.history.replaceState({}, '', newUrl)
  }

  router.replace(newUrl, { scroll: false })
}

const ensurePartnerId = () => {
  const partnerId = getPartnerIdFromStorage()

  if (!partnerId) {
    throw new PartnerIdNotFoundError()
  }

  return partnerId
}

const normalizeStationId = (stationId: string | number) => {
  if (typeof stationId === 'number') {
    return stationId
  }

  const parsed = Number.parseInt(stationId, 10)

  if (Number.isNaN(parsed)) {
    throw new Error('Invalid station id')
  }

  return parsed
}

export async function fetchStationFormData(
  stationId: string | number,
): Promise<{ id: number; formData: ChargingStationFormWithGallery }> {
  const response = await getChargingStationDetail(stationId)
  const apiData = Array.isArray(response.data) ? response.data[0] : response.data

  if (!apiData) {
    throw new Error('Charging station detail not found')
  }

  const formData = convertStationDetailToFormData(apiData)

  return {
    id: normalizeStationId(apiData.id),
    formData,
  }
}

export function buildUpdateStationRequest(
  submission: ChargingStationFormSubmission,
  stationId: string | number,
): ExtendedUpdateChargingStationRequest {
  const normalizedStationId = normalizeStationId(stationId)
  const workSchedule = submission.work ?? []
  const stationTypeIdValue =
    typeof submission.station_type_id === 'string'
      ? Number.parseInt(submission.station_type_id, 10)
      : submission.station_type_id

  if (Number.isNaN(stationTypeIdValue)) {
    throw new Error('Invalid station type id')
  }

  const request: ExtendedUpdateChargingStationRequest = {
    id: normalizedStationId,
    latitude: submission.coordinates.lat.toString(),
    longtitude: submission.coordinates.lng.toString(),
    station_name: submission.station_name,
    station_name_th: submission.station_name_th,
    station_name_lao: submission.station_name_lao,
    station_detail: submission.station_detail,
    station_detail_th: submission.station_detail_th,
    station_detail_lao: submission.station_detail_lao,
    station_type_id: stationTypeIdValue,
    address: submission.address,
    status: submission.status,
    show_on_map: submission.show_on_map,
    work: workSchedule,
    contact: submission.contact ?? '',
    image: submission.images,
    deletedImageIds: submission.deletedImageIds,
  }

  return request
}

export async function createStationRecord(
  request: CreateChargingStationRequest,
  createStation: (data: CreateChargingStationRequest) => Promise<unknown>,
): Promise<void> {
  ensurePartnerId()
  await createStation(request)
}

export async function updateStationRecord(
  stationId: string | number,
  teamGroupId: number,
  submission: ChargingStationFormSubmission,
  updateStation: (data: {
    stationId: string | number
    team_group_id: number
    data: ExtendedUpdateChargingStationRequest
  }) => Promise<unknown>,
): Promise<void> {
  ensurePartnerId()

  const payload = buildUpdateStationRequest(submission, stationId)

  await updateStation({
    stationId,
    team_group_id: teamGroupId,
    data: payload,
  })
}

export async function deleteStationRecord(
  stationId: string | number,
  deleteStation: (stationId: string | number) => Promise<unknown>,
): Promise<void> {
  await deleteStation(stationId)
}

export { formatStationDateTime }
