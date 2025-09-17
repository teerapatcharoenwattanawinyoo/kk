import { api } from '@/lib/api/config/axios'
import { API_ENDPOINTS } from '@/lib/constants'
import {
  type ChargingStationDetail,
  type ChargingStationsParams,
  type ChargingStationsResponse,
  type CreateChargingStationRequest,
  type CreateChargingStationResponse,
  type ExtendedUpdateChargingStationRequest,
  type GetChargingStationDetailResponse,
  type StationCategoriesResponse,
  type UpdateChargingStationResponse,
} from '@/modules/charging-stations/schemas/charging-stations.schema'

// ============================
// API Functions
// ============================

export async function getStationCategories(): Promise<StationCategoriesResponse> {
  try {
    const response = await api.get<StationCategoriesResponse>(API_ENDPOINTS.STATION.CATEGORIES)
    return response
  } catch (error) {
    console.error('Error fetching station categories:', error)
    throw error
  }
}

export async function getChargingStations(
  params: ChargingStationsParams,
): Promise<ChargingStationsResponse> {
  try {
    const { page = 1, pageSize = 10, team_group_id, ...otherParams } = params

    if (!team_group_id) {
      throw new Error('team_group_id is required')
    }

    const queryParamsObject: Record<string, string> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    }

    Object.entries(otherParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParamsObject[key] = value.toString()
      }
    })

    // team_group_id ไปใน URL path ไม่ใช่ query parameter
    const url = `${API_ENDPOINTS.STATION.TEAM_STATIONS}/${team_group_id}`

    const response = await api.get<ChargingStationsResponse>(url, {
      params: queryParamsObject,
    })

    return response
  } catch (error) {
    console.error('Error fetching charging stations:', error)
    throw error
  }
}

export async function createChargingStation(
  data: CreateChargingStationRequest,
): Promise<CreateChargingStationResponse> {
  try {
    console.log('🔥 Full input data:', JSON.stringify(data, null, 2))

    const formData = new FormData()

    // Add basic station data
    formData.append('latitude', data.latitude)
    formData.append('longtitude', data.longtitude)
    formData.append('station_name', data.station_name)
    formData.append('station_detail', data.station_detail)
    formData.append('address', data.address)
    formData.append('station_type_id', data.station_type_id.toString())
    formData.append('status', data.status.toString())
    formData.append('show_on_map', data.show_on_map.toString())
    // team_group_id จะไปใน query parameter ไม่ใส่ใน FormData

    // Add contact field (always send, even if empty)
    console.log('🔥 Contact value from data:', data.contact, 'Type:', typeof data.contact)
    formData.append('contact', data.contact ?? '')

    // Add optional multilingual fields
    if (data.station_name_th) {
      formData.append('station_name_th', data.station_name_th)
    }
    if (data.station_name_lao) {
      formData.append('station_name_lao', data.station_name_lao)
    }
    if (data.station_detail_th) {
      formData.append('station_detail_th', data.station_detail_th)
    }
    if (data.station_detail_lao) {
      formData.append('station_detail_lao', data.station_detail_lao)
    }

    // Add work time data
    data.work.forEach((workItem, index) => {
      formData.append(`work[${index}][work_day]`, workItem.work_day)
      formData.append(`work[${index}][work_status]`, workItem.work_status)
      formData.append(`work[${index}][work_time_start]`, workItem.work_time_start)
      formData.append(`work[${index}][work_time_end]`, workItem.work_time_end)
    })

    // Add images as File objects (use standard field naming)
    console.log('🔥 data.images:', data.image)
    console.log('🔥 data.images length:', data.image?.length)
    if (data.image && data.image.length > 0) {
      console.log('🔥 Processing images array:', data.image)
      data.image.forEach((image, index) => {
        // Ensure images are File objects
        if (image instanceof File) {
          // Use simple field naming: image (same field name for all images)
          formData.append(`image`, image)
        } else {
          console.warn(`Image at index ${index} is not a File object:`, image)
        }
      })
    }

    console.log('Sending FormData to create charging station')

    // Debug: Log all FormData entries
    console.log('FormData entries:')
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
      } else {
        console.log(`${key}: ${value}`)
      }
    }

    // สร้าง URL พร้อม team_group_id query parameter
    const queryParams = new URLSearchParams({
      team_group_id: data.team_group_id.toString(),
    })
    const url = `${API_ENDPOINTS.STATION.CREATE}?${queryParams.toString()}`

    const response = await api.post<CreateChargingStationResponse>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Create charging station response:', response)
    return response
  } catch (error) {
    console.error('Error creating charging station:', error)
    throw error
  }
}

export async function updateChargingStation(
  stationId: string | number,
  team_group_id: number,
  data: ExtendedUpdateChargingStationRequest,
): Promise<UpdateChargingStationResponse> {
  try {
    console.log('🔥 Full input data (UPDATE):', JSON.stringify(data, null, 2))

    const formData = new FormData()

    // Add basic station data
    formData.append('latitude', data.latitude)
    formData.append('longtitude', data.longtitude)
    formData.append('station_name', data.station_name)
    formData.append('station_detail', data.station_detail)
    formData.append('address', data.address)
    formData.append('station_type_id', data.station_type_id.toString())
    formData.append('status', data.status.toString())
    formData.append('show_on_map', data.show_on_map.toString())

    // Add contact field (always send, even if empty)
    console.log('🔥 Contact value from data (UPDATE):', data.contact, 'Type:', typeof data.contact)
    formData.append('contact', data.contact ?? '')

    // Add optional multilingual fields
    if (data.station_name_th) {
      formData.append('station_name_th', data.station_name_th)
    }
    if (data.station_name_lao) {
      formData.append('station_name_lao', data.station_name_lao)
    }
    if (data.station_detail_th) {
      formData.append('station_detail_th', data.station_detail_th)
    }
    if (data.station_detail_lao) {
      formData.append('station_detail_lao', data.station_detail_lao)
    }

    // Add work time data
    data.work.forEach((workItem, index) => {
      formData.append(`work[${index}][work_day]`, workItem.work_day)
      formData.append(`work[${index}][work_status]`, workItem.work_status)
      formData.append(`work[${index}][work_time_start]`, workItem.work_time_start)
      formData.append(`work[${index}][work_time_end]`, workItem.work_time_end)
    })

    // Add images as File objects (use standard field naming)
    console.log('🔥 data.images (UPDATE):', data.image)
    console.log('🔥 data.images length (UPDATE):', data.image?.length)
    if (data.image && data.image.length > 0) {
      console.log('🔥 Processing images array (UPDATE):', data.image)
      data.image.forEach((image, index) => {
        console.log(`🔥 Processing image ${index}:`, image)
        // Ensure images are File objects
        if (image instanceof File) {
          console.log(`🔥 Appending image ${index} to FormData as image`)
          // Use simple field naming: image (same field name for all images)
          formData.append(`image`, image)
        } else {
          console.warn(`Image at index ${index} is not a File object:`, image)
        }
      })
    }

    // Add deleted image IDs if provided
    if (data.deletedImageIds && data.deletedImageIds.length > 0) {
      data.deletedImageIds.forEach((imageId, index) => {
        formData.append(`deletedImageIds[${index}]`, imageId.toString())
      })
    }

    const queryParams = new URLSearchParams({
      team_group_id: team_group_id.toString(),
    })
    const url = `${API_ENDPOINTS.STATION.UPDATE}/${stationId}?${queryParams.toString()}`

    console.log('Sending FormData to update charging station')

    // Debug: Log all FormData entries
    console.log('FormData entries:')
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
      } else {
        console.log(`${key}: ${value}`)
      }
    }

    const response = await api.patch<UpdateChargingStationResponse>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Update charging station response:', response)
    return response
  } catch (error) {
    console.error('Error updating charging station:', error)
    throw error
  }
}

export async function deleteChargingStation(
  stationId: string | number,
): Promise<{ statusCode: number; message: string }> {
  try {
    const response = await api.delete<{ statusCode: number; message: string }>(
      `${API_ENDPOINTS.STATION.DELETE}/${stationId}`,
    )
    return response
  } catch (err) {
    console.error('Error deleting charging station:', err)
    throw err
  }
}

export async function deleteStationImage(
  partnerStationGalleryId: number,
): Promise<{ statusCode: number; message: string }> {
  try {
    const response = await api.delete<{ statusCode: number; message: string }>(
      `/partner-station-gallery/${partnerStationGalleryId}`,
    )

    console.log('Delete station image response:', response)
    return response
  } catch (error) {
    console.error('Error deleting station image:', error)
    throw error
  }
}

export async function getChargingStationDetail(
  stationId: string | number,
): Promise<GetChargingStationDetailResponse> {
  try {
    const response = await api.get<GetChargingStationDetailResponse>(
      `${API_ENDPOINTS.STATION.DETAIL}/${stationId}`,
    )

    console.log('🔥 Get charging station detail response:', response)
    console.log('🔥 Partner station work:', response.data?.partner_station_work)
    console.log('🔥 Partner station description:', response.data?.partner_station_description)
    console.log('🔥 Partner station gallery:', response.data?.partner_station_gallery)

    // ตรวจสอบว่าข้อมูลที่สำคัญมาครบหรือไม่
    if (!response.data?.partner_station_work) {
      console.warn('⚠️ partner_station_work is missing from API response')
    }
    if (!response.data?.partner_station_gallery) {
      console.warn('⚠️ partner_station_gallery is missing from API response')
    }

    return response
  } catch (error) {
    console.error('Error fetching charging station detail:', error)
    throw error
  }
}
