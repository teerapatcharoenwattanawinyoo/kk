// Revenue Server Actions - Revenue and payout operations
'use server'

import { api } from '@/lib/api/config/axios-server'
import { IResponse } from '@/lib/api/config/model'
import { API_ENDPOINTS } from '@/lib/constants'
import { PayoutConfirmRequest, PayoutInitRequest } from '../_schemas/payout.schema'
import { RevenueBalanceResponse } from '../_schemas/revenue.schema'

// ===========================
// READ OPERATIONS (QUERIES)
// ===========================

/**
 * Get revenue balance for a team
 */
export async function getRevenueBalanceServerAction(
  team_group_id: string | number,
): Promise<IResponse<RevenueBalanceResponse>> {
  try {
    const apiUrl = API_ENDPOINTS.TEAM_GROUPS.REVENUE.BALANCE.replace(
      '{team_group_id}',
      team_group_id.toString(),
    )
    const result = await api.get(apiUrl)
    return result
  } catch (error) {
    console.error('Error fetching revenue balance:', error)
    throw error
  }
}

// ===========================
// WRITE OPERATIONS (MUTATIONS)
// ===========================

/**
 * Initialize payout transaction
 */
export async function initPayoutServerAction(data: PayoutInitRequest): Promise<IResponse> {
  try {
    const result = await api.post(API_ENDPOINTS.TEAM_GROUPS.REVENUE.PAYOUT.INIT, data)
    return result
  } catch (error) {
    console.error('Error initializing payout:', error)
    throw error
  }
}

/**
 * Confirm payout transaction
 */
export async function confirmPayoutServerAction(data: PayoutConfirmRequest): Promise<IResponse> {
  try {
    const result = await api.post(API_ENDPOINTS.TEAM_GROUPS.REVENUE.PAYOUT.CONFIRM, data)
    return result
  } catch (error) {
    console.error('Error confirming payout:', error)
    throw error
  }
}
