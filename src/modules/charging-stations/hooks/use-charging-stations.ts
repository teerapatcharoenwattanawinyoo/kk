import { QUERY_KEYS } from '@/lib/constants'
import {
  convertStationDetailToFormData,
  createChargingStation,
  deleteChargingStation,
  deleteStationImage,
  getChargingStationDetail,
  getChargingStations,
  getStationCategories,
  updateChargingStation,
} from '@/modules/charging-stations/api/charging-station'
import {
  type ChargingStation,
  type ChargingStationDetail,
  type ChargingStationsParams,
  type ChargingStationsResponse,
  type CreateChargingStationRequest,
  type CreateChargingStationResponse,
  type GetChargingStationDetailResponse,
  type PartnerStationGalleryDetail,
  type StationCategory,
  type UpdateChargingStationRequest,
  type UpdateChargingStationResponse,
} from '@/modules/charging-stations/schemas/charging-stations.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useStationCategories() {
  return useQuery({
    queryKey: [...QUERY_KEYS.STATION, 'categories'],
    queryFn: async () => {
      try {
        const response = await getStationCategories()
        return response.data
      } catch (error) {
        console.error('API call failed, using mock data:', error)
        return
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Reduce retry to fallback to mock data faster
  })
}

export function useChargingStations(params: ChargingStationsParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.STATION, 'list', params],
    queryFn: async () => {
      const response = await getChargingStations(params)
      return response
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
    enabled: !!params.team_group_id, // Only run query if team_group_id is provided
  })
}

export function useCreateChargingStation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createChargingStation,
    onSuccess: (data, variables) => {
      // Invalidate and refetch charging stations list for the specific team
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.STATION, 'list'],
      })

      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.STATION, 'list', { team_group_id: variables.team_group_id }],
      })

      console.log('Charging station created successfully:', data)

      // Log uploaded images info if any
      if (data.data?.partner_station_gallery?.length > 0) {
        console.log('Station images uploaded:', data.data.partner_station_gallery)
      }
    },
    onError: (error) => {
      console.error('Failed to create charging station:', error)
    },
  })
}

export function useDeleteChargingStation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (stationId: string | number) => deleteChargingStation(stationId),
    onSuccess: (_data, stationId) => {
      // invalidate list เพื่อ refresh ข้อมูลหลังลบ
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.STATION, 'list'],
      })

      // invalidate detail ของสถานีที่เพิ่งลบ
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.STATION, 'detail', stationId],
      })
      console.log(`Charging station ${stationId} deleted successfully`)
    },
    onError: (error) => {
      console.error('Failed to delete charging station:', error)
    },
  })
}

export function useUpdateChargingStation() {
  const queryClient = useQueryClient()

  return useMutation<
    UpdateChargingStationResponse,
    Error,
    {
      stationId: string | number
      team_group_id: number
      data: UpdateChargingStationRequest
    }
  >({
    mutationFn: async ({ stationId, team_group_id, data }) => {
      return updateChargingStation(stationId, team_group_id, data)
    },
    onSuccess: (_data, variables) => {
      // invalidate list เพื่อ refresh ข้อมูลหลัง update
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.STATION, 'list'],
      })

      // invalidate specific team query
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.STATION, 'list', { team_group_id: variables.team_group_id }],
      })

      // invalidate detail ของสถานีที่เพิ่ง update
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.STATION, 'detail', variables.stationId],
      })
      console.log('Charging station updated successfully')
    },
    onError: (error) => {
      console.error('Failed to update charging station:', error)
    },
  })
}

export function useChargingStationDetail(stationId: string | number | null) {
  return useQuery({
    queryKey: [...QUERY_KEYS.STATION, 'detail', stationId],
    queryFn: async () => {
      if (!stationId) throw new Error('Station ID is required')
      const response = await getChargingStationDetail(stationId)
      return response.data
    },
    enabled: !!stationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  })
}

export function useDeleteStationImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (partnerStationGalleryId: number) => deleteStationImage(partnerStationGalleryId),
    onSuccess: (_data, partnerStationGalleryId) => {
      console.log(`Station image ${partnerStationGalleryId} deleted successfully`)

      // Invalidate all station queries to refresh data
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.STATION],
      })
    },
    onError: (error) => {
      console.error('Failed to delete station image:', error)
    },
  })
}

export function useChargingStationFormData(stationId: string | number | null) {
  const { data: stationDetail, ...queryResult } = useChargingStationDetail(stationId)

  const formData = stationDetail ? convertStationDetailToFormData(stationDetail) : null

  return {
    ...queryResult,
    data: stationDetail,
    formData,
  }
}

export type {
  ChargingStation,
  ChargingStationDetail,
  ChargingStationsParams,
  ChargingStationsResponse,
  CreateChargingStationRequest,
  CreateChargingStationResponse,
  GetChargingStationDetailResponse,
  PartnerStationGalleryDetail,
  StationCategory,
  UpdateChargingStationRequest,
  UpdateChargingStationResponse,
}
