import type {
  ChargerListResponse,
  ChargerTypeResponse,
  CreateChargerRequest,
  CreateChargerResponse,
  UpdateSerialNumberRequest,
  UpdateSerialNumberResponse,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_schemas/chargers.schema'
import {
  getChargersList,
  getChargerTypes,
  updateCharger,
  updateSerialNumber,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_servers/charger'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useChargersList(
  teamGroupId: string,
  page: string = '1',
  pageSize: string = '10',
  options?: {
    enableRealtime?: boolean
    refetchInterval?: number
    search?: string
    status?: string
    stationId?: string | number
    enabled?: boolean
  },
) {
  const {
    enableRealtime = true,
    refetchInterval = 30000,
    search,
    status,
    stationId,
    enabled = true,
  } = options || {}

  const pageNum = parseInt(page, 10)
  const pageSizeNum = parseInt(pageSize, 10)
  const stationIdNum =
    typeof stationId === 'string'
      ? parseInt(stationId, 10)
      : typeof stationId === 'number'
        ? stationId
        : undefined

  return useQuery<ChargerListResponse>({
    queryKey: [
      'chargers-list',
      teamGroupId,
      page, // use string in queryKey to match response
      pageSize, // use string in queryKey to match response
      search,
      status,
      stationId ?? null,
    ],
    queryFn: () =>
      getChargersList(
        teamGroupId,
        pageNum,
        pageSizeNum,
        stationIdNum as number | undefined,
        search,
        status,
      ),
    enabled: enabled && !!teamGroupId,
    // Enable realtime updates with polling
    refetchInterval: enableRealtime ? refetchInterval : false,
    // Refetch when window regains focus
    refetchOnWindowFocus: true,
    // Keep data fresh in background
    staleTime: 1000 * 30, // 30 seconds
    // Cache data for 5 minutes
    gcTime: 1000 * 60 * 5,
    // Retry on errors
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useUpdateCharger(teamGroupId: string) {
  const queryClient = useQueryClient()

  return useMutation<
    CreateChargerResponse,
    Error,
    { chargerId: number; data: CreateChargerRequest }
  >({
    mutationFn: ({ chargerId, data }) => updateCharger(teamGroupId, chargerId, data),
    onSuccess: () => {
      // Refetch all chargers list queries for this team group
      queryClient.invalidateQueries({
        queryKey: ['chargers-list', teamGroupId],
        exact: false, // This will invalidate all queries that start with this key
      })
    },
  })
}

export function useUpdateSerialNumber() {
  const queryClient = useQueryClient()

  return useMutation<UpdateSerialNumberResponse, Error, UpdateSerialNumberRequest>({
    mutationFn: (serialData) => updateSerialNumber(serialData),
    onSuccess: (data, variables) => {
      // Invalidate all chargers list queries
      queryClient.invalidateQueries({
        queryKey: ['chargers-list'],
        exact: false, // This will invalidate all queries that start with this key
      })
      queryClient.invalidateQueries({
        queryKey: ['charger-detail', variables.charger_id],
      })
    },
  })
}

export function useChargerTypes() {
  return useQuery<ChargerTypeResponse>({
    queryKey: ['charger-types'],
    queryFn: getChargerTypes,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}
