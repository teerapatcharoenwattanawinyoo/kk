import { QUERY_KEYS } from "@/lib/constants";
import { TeamHostListResponse } from "@/lib/schemas/team";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * Hook สำหรับดึงข้อมูล team จาก cache โดยตรง
 * ใช้เมื่อต้องการข้อมูล team เฉพาะตัวแต่ไม่ต้องการเรียก API ใหม่
 */
export const useTeamFromCache = (teamId: string) => {
  const queryClient = useQueryClient();

  const teamData = useMemo(() => {
    if (!teamId) return null;

    // ลองหาจาก cache ของ team host list ก่อน
    const cachedHostList = queryClient.getQueryData<TeamHostListResponse>([
      ...QUERY_KEYS.TEAMS,
      "host-list",
      undefined,
    ]);

    if (cachedHostList?.data?.data) {
      const team = cachedHostList.data.data.find(
        (team) => team.team_group_id.toString() === teamId,
      );
      if (team) return team;
    }

    return null;
  }, [queryClient, teamId]);

  return teamData;
};

/**
 * Hook สำหรับตรวจสอบว่ามีข้อมูลใน cache หรือไม่
 */
export const useHasCachedData = () => {
  const queryClient = useQueryClient();

  return useMemo(() => {
    const teamListData = queryClient.getQueryData(QUERY_KEYS.TEAMS);
    const teamHostData = queryClient.getQueryData([
      ...QUERY_KEYS.TEAMS,
      "host-list",
      undefined,
    ]);

    return !!(teamListData || teamHostData);
  }, [queryClient]);
};
