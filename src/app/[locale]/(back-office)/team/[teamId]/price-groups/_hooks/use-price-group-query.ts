import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/lib/constants'
import { PriceSetType } from '../_schemas'
import {
  fetchPriceSet,
  fetchPriceSetById,
  PriceGroup,
  PriceGroupDetailResponse,
  PriceSetResponse,
} from '../_services/priceGroupQuery'

const STALE_TIME = 5 * 60 * 1000 // 5 minutes
const GC_TIME = 10 * 60 * 1000 // 10 minutes

const usePriceSet = (
  type?: PriceSetType,
  page: number = 1,
  pageSize: number = 10,
  teamGroupId?: number | string | null,
) =>
  useQuery<PriceSetResponse>({
    queryKey: [...QUERY_KEYS.PRICE_SET, type, page, pageSize, teamGroupId ?? null],
    queryFn: () => fetchPriceSet(type, page, pageSize, teamGroupId),
    enabled: teamGroupId !== undefined && teamGroupId !== null,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })

interface UsePriceGroupDetailOptions {
  type?: PriceSetType
  page?: number
  pageSize?: number
}

const usePriceGroupDetail = (
  priceId?: string | null,
  { type, page = 1, pageSize = 100 }: UsePriceGroupDetailOptions = {},
) => {
  const numericId = priceId ? Number(priceId) : undefined

  return useQuery<PriceGroupDetailResponse, Error, PriceGroup | undefined>({
    queryKey: [...QUERY_KEYS.PRICE_SET, 'detail', type, page, pageSize, numericId],
    queryFn: () => fetchPriceSetById(String(numericId)),
    enabled: !!numericId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    select: (response) => response.data ?? undefined,
  })
}

export { usePriceGroupDetail, usePriceSet }
