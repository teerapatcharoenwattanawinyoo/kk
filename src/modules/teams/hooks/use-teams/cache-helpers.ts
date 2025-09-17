import type { QueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/constants";

import type { TeamListQueryResponse } from "@/modules/teams/schemas";

export type TeamListCacheEntry = [readonly unknown[], TeamListQueryResponse | undefined];

export const getTeamListCaches = (
  queryClient: QueryClient
): TeamListCacheEntry[] => {
  return queryClient.getQueriesData<TeamListQueryResponse>([
    QUERY_KEYS.TEAMS,
    "list",
  ]);
};

export const updateTeamListCaches = (
  queryClient: QueryClient,
  updater: (data: TeamListQueryResponse) => TeamListQueryResponse
): TeamListCacheEntry[] => {
  const caches = getTeamListCaches(queryClient);

  caches.forEach(([cacheKey, cacheData]) => {
    if (!cacheData) return;

    const updated = updater(cacheData);
    queryClient.setQueryData<TeamListQueryResponse>(cacheKey, updated);
  });

  return caches;
};

export const restoreTeamListCaches = (
  queryClient: QueryClient,
  caches: TeamListCacheEntry[]
) => {
  caches.forEach(([cacheKey, cacheData]) => {
    queryClient.setQueryData<TeamListQueryResponse>(cacheKey, cacheData);
  });
};
