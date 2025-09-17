import { API_ENDPOINTS } from '../../constants'
import type {
  PayoutConfirmRequest,
  PayoutConfirmResponse,
  PayoutInitRequest,
  PayoutInitResponse,
} from '../../schemas/payout'
import { api } from '../config/axios'
import { IResponse } from '../config/model'

// POST /partner/revenue/payout/init - Initialize payout transaction
export const initPayoutTransaction = async (
  data: PayoutInitRequest,
): Promise<IResponse<PayoutInitResponse>> => {
  return api.post(API_ENDPOINTS.TEAM_GROUPS.REVENUE.PAYOUT.INIT, data)
}

// POST /partner/revenue/payout/confirm - Confirm payout with OTP
export const confirmPayoutTransaction = async (
  data: PayoutConfirmRequest,
): Promise<IResponse<PayoutConfirmResponse>> => {
  return api.post(API_ENDPOINTS.TEAM_GROUPS.REVENUE.PAYOUT.CONFIRM, data)
}

// Re-export types for convenience
export type { PayoutConfirmRequest, PayoutConfirmResponse, PayoutInitRequest, PayoutInitResponse }
