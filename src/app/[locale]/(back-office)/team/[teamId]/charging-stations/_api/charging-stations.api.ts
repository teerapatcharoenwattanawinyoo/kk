'use client'
import {
  type ChargingStationsParams,
  type ChargingStationsResponse,
  type CreateChargingStationRequest,
  type CreateChargingStationResponse,
  type ExtendedUpdateChargingStationRequest,
  type GetChargingStationDetailResponse,
  type StationCategoriesResponse,
  type UpdateChargingStationResponse,
} from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations/_schemas'
import { api } from '@/lib/api/config/axios-client'
import { API_ENDPOINTS } from '@/lib/constants'

type BasicMessageResponse = { statusCode: number; message: string }

function createStationFormData(
  data: CreateChargingStationRequest | ExtendedUpdateChargingStationRequest,
): FormData {
  const formData = new FormData()

  formData.append('latitude', data.latitude)
  formData.append('longtitude', data.longtitude)
  formData.append('station_name', data.station_name)
  formData.append('station_detail', data.station_detail)
  formData.append('address', data.address)
  formData.append('station_type_id', data.station_type_id.toString())
  formData.append('status', data.status.toString())
  formData.append('show_on_map', data.show_on_map.toString())
  formData.append('contact', data.contact ?? '')

  if (data.station_name_th) formData.append('station_name_th', data.station_name_th)
  if (data.station_name_lao) formData.append('station_name_lao', data.station_name_lao)
  if (data.station_detail_th) formData.append('station_detail_th', data.station_detail_th)
  if (data.station_detail_lao) formData.append('station_detail_lao', data.station_detail_lao)

  data.work.forEach((workItem, index) => {
    formData.append(`work[${index}][work_day]`, workItem.work_day)
    formData.append(`work[${index}][work_status]`, workItem.work_status)
    formData.append(`work[${index}][work_time_start]`, workItem.work_time_start)
    formData.append(`work[${index}][work_time_end]`, workItem.work_time_end)
  })

  data.images?.forEach((image) => {
    if (image instanceof File) {
      formData.append('image', image)
    }
  })

  return formData
}

export async function fetchStationCategories(): Promise<StationCategoriesResponse> {
  return api.get<StationCategoriesResponse>(API_ENDPOINTS.STATION.CATEGORIES)
}

export async function fetchChargingStations(
  params: ChargingStationsParams,
): Promise<ChargingStationsResponse> {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
  if (params.search) queryParams.append('search', params.search)
  if (params.status) queryParams.append('status', params.status)

  const apiUrl = queryParams.toString()
    ? `${API_ENDPOINTS.STATION.TEAM_STATIONS}/${params.team_group_id}?${queryParams.toString()}`
    : `${API_ENDPOINTS.STATION.TEAM_STATIONS}/${params.team_group_id}`

  return api.get<ChargingStationsResponse>(apiUrl)
}

export async function fetchChargingStationDetail(
  stationId: string | number,
): Promise<GetChargingStationDetailResponse> {
  try {
    const apiUrl = `${API_ENDPOINTS.STATION.DETAIL}/${stationId}`
    const result = await api.get<GetChargingStationDetailResponse>(apiUrl)

    if (!result.data?.partner_station_work) {
      console.warn('⚠️ partner_station_work is missing from API response')
    }
    if (!result.data?.partner_station_gallery) {
      console.warn('⚠️ partner_station_gallery is missing from API response')
    }

    return result
  } catch (error) {
    console.error('Error fetching charging station detail:', error)
    throw error
  }
}

export async function createChargingStation(
  data: CreateChargingStationRequest,
): Promise<CreateChargingStationResponse> {
  try {
    const formData = createStationFormData(data)

    const queryParams = new URLSearchParams({
      team_group_id: data.team_group_id.toString(),
    })
    const apiUrl = `${API_ENDPOINTS.STATION.CREATE}?${queryParams.toString()}`

    return await api.post<CreateChargingStationResponse>(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (error) {
    console.error('Error creating charging station:', error)
    throw error
  }
}

export async function updateChargingStation(
  stationId: string | number,
  teamGroupId: number,
  data: ExtendedUpdateChargingStationRequest,
): Promise<UpdateChargingStationResponse> {
  try {
    const formData = createStationFormData(data)

    data.deletedImageIds?.forEach((imageId, index) => {
      formData.append(`deletedImageIds[${index}]`, imageId.toString())
    })

    const queryParams = new URLSearchParams({
      team_group_id: teamGroupId.toString(),
    })
    const apiUrl = `${API_ENDPOINTS.STATION.UPDATE}/${stationId}?${queryParams.toString()}`

    return await api.patch<UpdateChargingStationResponse>(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (error) {
    console.error('Error updating charging station:', error)
    throw error
  }
}

export async function deleteChargingStation(
  stationId: string | number,
): Promise<BasicMessageResponse> {
  try {
    const apiUrl = `${API_ENDPOINTS.STATION.DELETE}/${stationId}`
    return await api.delete<BasicMessageResponse>(apiUrl)
  } catch (error) {
    console.error('Error deleting charging station:', error)
    throw error
  }
}

export async function deleteStationImage(
  partnerStationGalleryId: number,
): Promise<BasicMessageResponse> {
  try {
    const apiUrl = `/partner-station-gallery/${partnerStationGalleryId}`
    return await api.delete<BasicMessageResponse>(apiUrl)
  } catch (error) {
    console.error('Error deleting station image:', error)
    throw error
  }
}
