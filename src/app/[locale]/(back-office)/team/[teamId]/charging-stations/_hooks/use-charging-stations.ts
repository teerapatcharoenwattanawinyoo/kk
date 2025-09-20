'use client'
import {
  createChargingStation,
  deleteChargingStation,
  deleteStationImage,
  fetchChargingStationDetail,
  fetchChargingStations,
  fetchStationCategories,
  updateChargingStation,
} from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations/_api/charging-stations.api'
import {
  type ChargingStation,
  type ChargingStationDetail,
  type ChargingStationsParams,
  type ChargingStationsResponse,
  type CreateChargingStationRequest,
  type CreateChargingStationResponse,
  type ExtendedUpdateChargingStationRequest,
  type GetChargingStationDetailResponse,
  type PartnerStationGalleryDetail,
  type StationCategory,
  type UpdateChargingStationResponse,
} from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations/_schemas'
import { convertStationDetailToFormData } from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations/_utils'
import { QUERY_KEYS } from '@/lib/constants'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface MutationContext {
  previousStations: ChargingStationsResponse | undefined
}

export function useStationCategories() {
  return useQuery<StationCategory[]>({
    queryKey: [QUERY_KEYS.STATION, 'categories'],
    queryFn: async () => {
      const response = await fetchStationCategories()
      return response.data ?? []
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  })
}

export function useChargingStations(params?: ChargingStationsParams) {
  return useQuery<ChargingStationsResponse>({
    queryKey: [QUERY_KEYS.STATION, 'list', params],
    queryFn: async () => {
      if (!params) {
        throw new Error('Charging station params are required')
      }

      const response = await fetchChargingStations(params)
      console.log('fetchChargingStations response', response)
      return response
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!params?.team_group_id,
    retry: 2,
  })
}

export function useCreateChargingStation() {
  const queryClient = useQueryClient()

  return useMutation<CreateChargingStationResponse, Error, CreateChargingStationRequest>({
    mutationFn: createChargingStation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STATION, 'list'],
      })
    },
    onError: (error) => {
      console.error('Error creating charging station:', error)
    },
  })
}

export function useDeleteChargingStation() {
  const queryClient = useQueryClient()

  return useMutation<
    { statusCode: number; message: string },
    Error,
    string | number,
    MutationContext
  >({
    mutationFn: (stationId: string | number) => deleteChargingStation(stationId),
    onMutate: async (stationId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.STATION, 'list'],
      })

      const previousStations = queryClient.getQueryData<ChargingStationsResponse>([
        QUERY_KEYS.STATION,
        'list',
      ])

      queryClient.setQueryData(
        [QUERY_KEYS.STATION, 'list'],
        (old: ChargingStationsResponse | undefined) => {
          const list = old?.data?.data
          if (!list) return old
          return {
            ...old,
            data: {
              ...old.data,
              data: list.filter((station) => station.id.toString() !== stationId.toString()),
            },
          }
        },
      )

      return { previousStations }
    },
    onError: (error, stationId, context) => {
      if (context?.previousStations) {
        queryClient.setQueryData([QUERY_KEYS.STATION, 'list'], context.previousStations)
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STATION, 'detail', stationId],
      })
      console.error('Failed to delete charging station:', error)
    },
    onSuccess: (_data, stationId) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STATION, 'list'],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STATION, 'detail', stationId],
      })
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
      data: ExtendedUpdateChargingStationRequest
    },
    MutationContext
  >({
    mutationFn: async ({ stationId, team_group_id, data }) => {
      return updateChargingStation(stationId, team_group_id, data)
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.STATION, 'list'],
      })

      const previousStations = queryClient.getQueryData<ChargingStationsResponse>([
        QUERY_KEYS.STATION,
        'list',
      ])

      queryClient.setQueryData(
        [QUERY_KEYS.STATION, 'list'],
        (old: ChargingStationsResponse | undefined) => {
          const list = old?.data?.data
          if (!list) return old
          const updated = list.map((station) =>
            station.id.toString() === variables.stationId.toString()
              ? {
                  ...station,
                  station_name: variables.data.station_name,
                  station_detail: variables.data.station_detail,
                  address: variables.data.address,
                  status: variables.data.status,
                  latitude: variables.data.latitude,
                  longtitude: variables.data.longtitude,
                }
              : station,
          )
          return {
            ...old,
            data: {
              ...old!.data,
              data: updated,
            },
          }
        },
      )

      return { previousStations }
    },
    onError: (error, _variables, context) => {
      if (context?.previousStations) {
        queryClient.setQueryData([QUERY_KEYS.STATION, 'list'], context.previousStations)
      }
      console.error('Failed to update charging station:', error)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STATION, 'list'],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STATION, 'list', { team_group_id: variables.team_group_id }],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STATION, 'detail', variables.stationId],
      })
    },
  })
}

export function useChargingStationDetail(stationId: string | number | null) {
  return useQuery<GetChargingStationDetailResponse>({
    queryKey: [QUERY_KEYS.STATION, 'detail', stationId],
    queryFn: () => {
      if (!stationId) throw new Error('Station ID is required')
      return fetchChargingStationDetail(stationId)
    },
    enabled: !!stationId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  })
}

export function useDeleteStationImage() {
  const queryClient = useQueryClient()

  return useMutation<{ statusCode: number; message: string }, Error, number>({
    mutationFn: (partnerStationGalleryId: number) =>
      deleteStationImage(partnerStationGalleryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STATION],
      })
    },
    onError: (error) => {
      console.error('Failed to delete station image:', error)
    },
  })
}

export function useChargingStationFormData(stationId: string | number | null) {
  const { data: stationRes, ...queryResult } = useChargingStationDetail(stationId)

  const stationDetail = stationRes?.data ?? null

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
  UpdateChargingStationResponse,
}
