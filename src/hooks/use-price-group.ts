import {
  CreateByParentRequest,
  CreatePriceRequest,
  CreatePriceResponse,
  createPriceSet,
  createPriceSetByParent,
  getPriceSet,
  PriceSetResponse,
  UpdatePriceRequest,
  UpdatePriceResponse,
  updatePriceSet,
} from "@/lib/api/team-group/price-groups";
import { QUERY_KEYS } from "@/lib/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const GC_TIME = 10 * 60 * 1000; // 10 minutes

export function usePriceSet(
  type?: "general" | "member",
  page: number = 1,
  pageSize: number = 10,
) {
  return useQuery<PriceSetResponse>({
    queryKey: [...QUERY_KEYS.PRICE_SET, type, page, pageSize],
    queryFn: () => getPriceSet(type, page, pageSize),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useCreatePriceSet() {
  const queryClient = useQueryClient();

  return useMutation<CreatePriceResponse, Error, CreatePriceRequest>({
    mutationFn: (data) => {
      console.log("useCreatePriceSet - calling createPriceSet with:", data);
      return createPriceSet(data);
    },
    onSuccess: async (data) => {
      console.log("Price set created successfully:", data);
      // Invalidate and refetch price set queries
      await queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.PRICE_SET],
      });
      // Force immediate refetch to get updated data
      await queryClient.refetchQueries({
        queryKey: [...QUERY_KEYS.PRICE_SET],
      });
    },
    onError: (error, variables) => {
      console.error("Failed to create price set:", {
        error,
        variables,
        timestamp: new Date().toISOString(),
      });
    },
  });
}

export function useUpdatePriceSet() {
  const queryClient = useQueryClient();
  return useMutation<
    UpdatePriceResponse,
    Error,
    { priceId: string; data: UpdatePriceRequest }
  >({
    mutationFn: ({ priceId, data }) => updatePriceSet(priceId, data),
    onSuccess: async () => {
      console.log("Price set updated successfully");
      // Invalidate and refetch price set queries
      await queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.PRICE_SET],
      });
      // Force immediate refetch to get updated data
      await queryClient.refetchQueries({
        queryKey: [...QUERY_KEYS.PRICE_SET],
      });
    },
    onError: (error, variables) => {
      console.error("Failed to update price set:", {
        error,
        variables,
        timestamp: new Date().toISOString(),
      });
    },
  });
}

export function useCreatePriceSetByParent() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, CreateByParentRequest>({
    mutationFn: createPriceSetByParent,
    onSuccess: async (response) => {
      console.log("Price application response:", response);
      await queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.PRICE_SET],
      });
      // Force immediate refetch to get updated data
      await queryClient.refetchQueries({
        queryKey: [...QUERY_KEYS.PRICE_SET],
      });
    },
    onError: (error, variables) => {
      console.error("Price application error:", {
        error,
        variables,
        timestamp: new Date().toISOString(),
      });
    },
  });
}
