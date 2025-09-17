import { getTeamHostList, getTeamList } from "@/lib/api/team-group/team";
import { QUERY_KEYS } from "@/lib/constants";
import { QueryClient } from "@tanstack/react-query";

/**
 * Prefetch team data ที่ใช้บ่อยเพื่อป้องกันการเรียก API ซ้ำ
 */
export const prefetchTeamData = async (queryClient: QueryClient) => {
  // Prefetch team list
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.TEAMS,
    queryFn: getTeamList,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Prefetch team host list
  await queryClient.prefetchQuery({
    queryKey: [...QUERY_KEYS.TEAMS, "host-list", undefined],
    queryFn: () => getTeamHostList(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * ตรวจสอบว่ามี cached data หรือไม่
 */
export const hasCachedTeamData = (queryClient: QueryClient): boolean => {
  const teamListData = queryClient.getQueryData(QUERY_KEYS.TEAMS);
  const teamHostData = queryClient.getQueryData([
    ...QUERY_KEYS.TEAMS,
    "host-list",
    undefined,
  ]);

  return !!(teamListData || teamHostData);
};

/**
 * Force refresh ข้อมูล team ทั้งหมด (ใช้เมื่อมีการเปลี่ยนแปลงข้อมูลสำคัญ)
 */
export const refreshAllTeamData = async (queryClient: QueryClient) => {
  await queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.TEAMS,
    exact: false, // invalidate ทุก query ที่ขึ้นต้นด้วย QUERY_KEYS.TEAMS
  });

  // Refetch ทันที
  await queryClient.refetchQueries({
    queryKey: QUERY_KEYS.TEAMS,
    exact: false,
  });
};

/**
 * Clear cache เมื่อ logout
 */
export const clearTeamCache = (queryClient: QueryClient) => {
  queryClient.removeQueries({
    queryKey: QUERY_KEYS.TEAMS,
    exact: false,
  });
};
