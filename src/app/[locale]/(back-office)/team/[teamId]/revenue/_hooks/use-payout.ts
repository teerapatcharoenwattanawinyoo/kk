import type {
  PayoutConfirmRequest,
  PayoutInitRequest,
} from '@/app/[locale]/(back-office)/team/[teamId]/revenue/_schemas/payout.schema'
import { QUERY_KEYS } from '@/lib/constants'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  confirmPayoutServerAction,
  initPayoutServerAction,
} from '../_servers/revenue.actions'

// ==========================
// MUTATIONS
// ==========================

// Initialize payout transaction mutation
export const useInitPayout = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, PayoutInitRequest>({
    mutationFn: (data: PayoutInitRequest) => initPayoutServerAction(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVENUE_BALANCE,
      })

      toast.success(data?.message || 'ส่ง OTP เรียบร้อยแล้ว')
    },
    onError: (
      error: Error & {
        response?: {
          data?: {
            message?: string
            statusCode?: number
          }
          status?: number
        }
      },
    ) => {
      const errorMessage = error?.response?.data?.message
      const statusCode =
        error?.response?.data?.statusCode || error?.response?.status

      if (errorMessage) {
        toast.error(errorMessage)
      } else if (statusCode === 400) {
        toast.error('ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่')
      } else {
        toast.error('เกิดข้อผิดพลาดในการส่ง OTP กรุณาลองใหม่อีกครั้ง')
      }
    },
    retry: false, // Disable retry to prevent multiple API calls
  })
}

// Confirm payout transaction mutation
export const useConfirmPayout = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, PayoutConfirmRequest>({
    mutationFn: (data: PayoutConfirmRequest) => confirmPayoutServerAction(data),
    onSuccess: (data) => {
      console.log('🎭 useConfirmPayout onSuccess - invalidating REVENUE_BALANCE after successful withdraw')

      // Invalidate balance after successful withdrawal
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVENUE_BALANCE,
      })

      toast.success(data?.message || 'ถอนเงินเรียบร้อยแล้ว')
    },
    onError: (
      error: Error & {
        response?: {
          data?: {
            message?: string
            statusCode?: number
          }
          status?: number
        }
      },
    ) => {
      const errorMessage = error?.response?.data?.message
      const statusCode =
        error?.response?.data?.statusCode || error?.response?.status

      if (errorMessage) {
        toast.error(errorMessage)
      } else if (statusCode === 404) {
        toast.error('ไม่พบรายการถอนเงิน กรุณาเริ่มต้นใหม่')
      } else if (statusCode === 500) {
        toast.error('เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง')
      } else {
        toast.error('รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่')
      }
    },
    retry: false, // Disable retry to prevent multiple API calls
  })
}

// Export types for convenience
export type { PayoutConfirmRequest, PayoutInitRequest }
