import {
  PayoutConfirmRequest,
  PayoutConfirmResponse,
  PayoutInitRequest,
  PayoutInitResponse,
} from '@/app/[locale]/(back-office)/team/[teamId]/revenue/_schemas/payout.schema'
import { API_ENDPOINTS } from '../../constants'
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
