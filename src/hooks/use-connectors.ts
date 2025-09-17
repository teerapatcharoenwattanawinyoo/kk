import {
  createConnector,
  CreateConnectorRequest,
  CreateConnectorResponse,
  deleteConnector,
  DeleteConnectorResponse,
  getChargerTypes,
  getConnectorsList,
  updateConnector,
  UpdateConnectorRequest,
  UpdateConnectorResponse,
} from "@/lib/api/team-group/connectors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useChargerTypes() {
  return useQuery({
    queryKey: ["charger-types"],
    queryFn: getChargerTypes,
  });
}

export function useConnectorsList(
  teamGroupId: string,
  page: string = "1",
  pageSize: string = "10",
  options?: {
    enableRealtime?: boolean;
    refetchInterval?: number;
    search?: string;
    status?: string;
    chargerId?: string | number;
    enabled?: boolean;
  },
) {
  const {
    enableRealtime = true,
    refetchInterval = 30000,
    search = "",
    status = "",
    chargerId,
    enabled = true,
  } = options || {};

  // Convert strings to numbers for API call since API expects numbers
  const pageNum = parseInt(page, 10);
  const pageSizeNum = parseInt(pageSize, 10);

  const chargerIdNum =
    typeof chargerId === "string"
      ? parseInt(chargerId, 10)
      : typeof chargerId === "number"
        ? chargerId
        : undefined;

  return useQuery({
    queryKey: [
      "connectors-list",
      teamGroupId,
      page,
      pageSize,
      search,
      status,
      chargerId ?? null,
    ], // include search, status, chargerId in queryKey
    queryFn: () =>
      getConnectorsList(
        teamGroupId,
        pageNum,
        pageSizeNum,
        search,
        status,
        chargerIdNum,
      ),
    enabled: enabled && !!teamGroupId,
    // Enable realtime updates with polling every 30 seconds
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
  });
}

export function useCreateConnector() {
  const queryClient = useQueryClient();

  return useMutation<CreateConnectorResponse, Error, CreateConnectorRequest>({
    mutationFn: createConnector,
    onSuccess: (data) => {
      // Invalidate and refetch connectors list to show the new connector
      queryClient.invalidateQueries({
        queryKey: ["connectors-list"],
      });

      // You could also invalidate chargers list if needed
      queryClient.invalidateQueries({
        queryKey: ["chargers-list"],
      });

      console.log("Connector created successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to create connector:", error);
    },
  });
}

export function useUpdateConnector() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateConnectorResponse,
    Error,
    { connectorId: number | string; data: UpdateConnectorRequest }
  >({
    mutationFn: ({ connectorId, data }) => updateConnector(connectorId, data),
    onSuccess: (data) => {
      // Invalidate and refetch connectors list to show the updated connector
      queryClient.invalidateQueries({
        queryKey: ["connectors-list"],
      });

      // You could also invalidate chargers list if needed
      queryClient.invalidateQueries({
        queryKey: ["chargers-list"],
      });

      console.log("Connector updated successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to update connector:", error);
    },
  });
}

export function useDeleteConnector() {
  const queryClient = useQueryClient();

  return useMutation<DeleteConnectorResponse, Error, number | string>({
    mutationFn: deleteConnector,
    onSuccess: (data) => {
      // Invalidate and refetch connectors list to reflect the deletion
      queryClient.invalidateQueries({
        queryKey: ["connectors-list"],
      });

      // Also invalidate chargers list since connector count might change
      queryClient.invalidateQueries({
        queryKey: ["chargers-list"],
      });

      console.log("Connector deleted successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to delete connector:", error);
    },
  });
}
