import { IResponse } from '@/lib/api/config/model'
import { getRevenueBalanceApi } from '@/lib/api/team-group/revenue'
import { QUERY_KEYS } from '@/lib/constants'
import { RevenueBalanceResponse } from '@/lib/schemas/revenue'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook สำหรับดึงข้อมูล Revenue Balance
 */
export const useRevenueBalance = (team_group_id: string | number) => {
  return useQuery<IResponse<RevenueBalanceResponse>>({
    queryKey: [QUERY_KEYS.REVENUE_BALANCE, team_group_id],
    queryFn: () => getRevenueBalanceApi(team_group_id),
    staleTime: 2 * 60 * 1000, // ข้อมูลจะถือว่าใหม่เป็นเวลา 2 นาที
    gcTime: 5 * 60 * 1000, // เก็บข้อมูลใน cache เป็นเวลา 5 นาที
    refetchOnWindowFocus: true, // Refetch เมื่อหน้าต่างได้ focus (สำหรับข้อมูลเงิน)
    refetchOnMount: true,
    retry: 3, // ลองใหม่ 3 ครั้งถ้าเกิดข้อผิดพลาด
    enabled: !!team_group_id, // Query จะทำงานเมื่อมี team_group_id เท่านั้น
  })
}
