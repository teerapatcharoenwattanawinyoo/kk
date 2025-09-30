import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  applyPriceSetToParent,
  createPriceSet,
  CreateByParentRequest,
  CreateByParentResponse,
  CreatePriceRequest,
  CreatePriceResponse,
  updatePriceSet,
  UpdatePriceRequest,
  UpdatePriceResponse,
} from '../_services/priceGroupMutation'
import { QUERY_KEYS } from '@/lib/constants'

const useRefreshPriceSet = () => {
  const queryClient = useQueryClient()

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.PRICE_SET],
    })
    await queryClient.refetchQueries({
      queryKey: [...QUERY_KEYS.PRICE_SET],
    })
  }
}

export const useCreatePriceSet = () => {
  const refreshPriceSet = useRefreshPriceSet()

  return useMutation<CreatePriceResponse, Error, CreatePriceRequest>({
    mutationFn: createPriceSet,
    onSuccess: refreshPriceSet,
    onError: (error, variables) => {
      console.error('Failed to create price set:', {
        error,
        variables,
        timestamp: new Date().toISOString(),
      })
    },
  })
}

export const useUpdatePriceSet = () => {
  const refreshPriceSet = useRefreshPriceSet()

  return useMutation<UpdatePriceResponse, Error, { priceId: string; data: UpdatePriceRequest }>(
    {
      mutationFn: ({ priceId, data }) => updatePriceSet(priceId, data),
      onSuccess: refreshPriceSet,
      onError: (error, variables) => {
        console.error('Failed to update price set:', {
          error,
          variables,
          timestamp: new Date().toISOString(),
        })
      },
    },
  )
}

export const useCreatePriceSetByParent = () => {
  const refreshPriceSet = useRefreshPriceSet()

  return useMutation<unknown, Error, CreateByParentRequest>({
    mutationFn: applyPriceSetToParent,
    onSuccess: refreshPriceSet,
    onError: (error, variables) => {
      console.error('Price application error:', {
        error,
        variables,
        timestamp: new Date().toISOString(),
      })
    },
  })
}

