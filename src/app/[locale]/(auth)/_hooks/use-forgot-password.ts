import {
  forgotPasswordApi,
  resetPasswordApi,
  verifyEmailOTPApi,
  verifyPhoneOTPApi,
  type ForgotPasswordEmailRequest,
  type ForgotPasswordPhoneRequest,
  type ResetPasswordRequest,
  type VerifyEmailOTPRequest,
  type VerifyPhoneOTPRequest,
} from '@/app/[locale]/(auth)/_api/forgot-password'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

// Re-export types
export type {
  ForgotPasswordEmailRequest,
  ForgotPasswordPhoneRequest,
  ResetPasswordRequest,
  VerifyEmailOTPRequest,
  VerifyPhoneOTPRequest,
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: (data) => {
      toast.success(data.message || 'OTP sent successfully')
    },
    onError: (
      error: Error & {
        response?: {
          data?: {
            message?: string
          }
        }
      },
    ) => {
      toast.error(error?.response?.data?.message || 'Failed to send OTP')
    },
  })
}

export const useVerifyEmailOTP = () => {
  return useMutation({
    mutationFn: verifyEmailOTPApi,
    onSuccess: (data) => {
      toast.success(data.message || 'OTP verified successfully')
    },
    onError: (
      error: Error & {
        response?: {
          data?: {
            message?: string
          }
        }
      },
    ) => {
      toast.error(error?.response?.data?.message || 'Invalid OTP')
    },
  })
}

export const useVerifyPhoneOTP = () => {
  return useMutation({
    mutationFn: verifyPhoneOTPApi,
    onSuccess: (data) => {
      toast.success(data.message || 'OTP verified successfully')
    },
    onError: (
      error: Error & {
        response?: {
          data?: {
            message?: string
          }
        }
      },
    ) => {
      toast.error(error?.response?.data?.message || 'Invalid OTP')
    },
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (
      error: Error & {
        response?: {
          data?: {
            message?: string
          }
        }
      },
    ) => {
      toast.error(error?.response?.data?.message || 'Failed to reset password')
    },
  })
}
