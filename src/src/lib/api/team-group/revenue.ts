import { RevenueBalanceResponse } from '@/app/[locale]/(back-office)/team/[teamId]/revenue/_schemas/revenue.schema'
import { IResponse } from '@/lib/api/config/model'
import { API_ENDPOINTS } from '@/lib/constants'
import { api } from '../config/axios'

//  ดึงข้อมูล Revenue Balance
export const getRevenueBalanceApi = async (
  team_group_id: string | number,
): Promise<IResponse<RevenueBalanceResponse>> => {
  const url = API_ENDPOINTS.TEAM_GROUPS.REVENUE.BALANCE.replace(
    '{team_group_id}',
    team_group_id.toString(),
  )
  return await api.get<IResponse<RevenueBalanceResponse>>(url)
}
