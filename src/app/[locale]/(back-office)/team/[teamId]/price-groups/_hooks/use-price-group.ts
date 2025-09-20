import {
  CreateByParentRequest,
  CreatePriceRequest,
  CreatePriceResponse,
  createPriceSet,
  createPriceSetByParent,
  getPriceSet,
  PriceGroup,
  PriceSetResponse,
  UpdatePriceRequest,
  UpdatePriceResponse,
  updatePriceSet,
} from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_servers/price-groups'
import { QUERY_KEYS } from '@/lib/constants'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const STALE_TIME = 5 * 60 * 1000 // 5 minutes
const GC_TIME = 10 * 60 * 1000 // 10 minutes

export function usePriceSet(type?: 'general' | 'member', page: number = 1, pageSize: number = 10) {
  return useQuery<PriceSetResponse>({
    queryKey: [...QUERY_KEYS.PRICE_SET, type, page, pageSize],
    queryFn: () => getPriceSet(type, page, pageSize),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}

export function useCreatePriceSet() {
  const queryClient = useQueryClient()

  return useMutation<CreatePriceResponse, Error, CreatePriceRequest>({
    mutationFn: (data) => createPriceSet(data),
    onSuccess: async (_data) => {
      // Invalidate and refetch price set queries
      await queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.PRICE_SET],
      })
      // Force immediate refetch to get updated data
      await queryClient.refetchQueries({
        queryKey: [...QUERY_KEYS.PRICE_SET],
      })
    },
    onError: (error, variables) => {
      console.error('Failed to create price set:', {
        error,
        variables,
        timestamp: new Date().toISOString(),
      })
    },
  })
}

export function useUpdatePriceSet() {
  const queryClient = useQueryClient()
  return useMutation<UpdatePriceResponse, Error, { priceId: string; data: UpdatePriceRequest }>({
    mutationFn: ({ priceId, data }) => updatePriceSet(priceId, data),
    onSuccess: async () => {
      // Invalidate and refetch price set queries
      await queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.PRICE_SET],
      })
      // Force immediate refetch to get updated data
      await queryClient.refetchQueries({
        queryKey: [...QUERY_KEYS.PRICE_SET],
      })
    },
    onError: (error, variables) => {
      console.error('Failed to update price set:', {
        error,
        variables,
        timestamp: new Date().toISOString(),
      })
    },
  })
}

export function useCreatePriceSetByParent() {
  const queryClient = useQueryClient()

  return useMutation<unknown, Error, CreateByParentRequest>({
    mutationFn: createPriceSetByParent,
    onSuccess: async (_response) => {
      await queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.PRICE_SET],
      })
      // Force immediate refetch to get updated data
      await queryClient.refetchQueries({
        queryKey: [...QUERY_KEYS.PRICE_SET],
      })
    },
    onError: (error, variables) => {
      console.error('Price application error:', {
        error,
        variables,
        timestamp: new Date().toISOString(),
      })
    },
  })
}

interface UsePriceGroupDetailOptions {
  type?: 'general' | 'member'
  page?: number
  pageSize?: number
}

export function usePriceGroupDetail(
  priceId?: string | null,
  { type, page = 1, pageSize = 100 }: UsePriceGroupDetailOptions = {},
) {
  const numericId = priceId ? Number(priceId) : undefined

  return useQuery<PriceSetResponse, Error, PriceGroup | undefined>({
    queryKey: [...QUERY_KEYS.PRICE_SET, 'detail', type, page, pageSize, numericId],
    queryFn: () => getPriceSet(type, page, pageSize),
    enabled: !!numericId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    select: (response) => {
      return response.data?.data?.find((group) => group.id === numericId)
    },
  })
}
