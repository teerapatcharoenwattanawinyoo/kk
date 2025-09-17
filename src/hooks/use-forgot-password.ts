import { toast } from '@/hooks/use-toast'
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
} from '@/modules/auth/api/forgot-password'
import { useMutation } from '@tanstack/react-query'

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
      toast({
        title: 'Success',
        description: data.message || 'OTP sent successfully',
      })
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
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to send OTP',
        variant: 'destructive',
      })
    },
  })
}

export const useVerifyEmailOTP = () => {
  return useMutation({
    mutationFn: verifyEmailOTPApi,
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: data.message || 'OTP verified successfully',
      })
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
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Invalid OTP',
        variant: 'destructive',
      })
    },
  })
}

export const useVerifyPhoneOTP = () => {
  return useMutation({
    mutationFn: verifyPhoneOTPApi,
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: data.message || 'OTP verified successfully',
      })
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
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Invalid OTP',
        variant: 'destructive',
      })
    },
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: data.message || 'Password reset successfully',
      })
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
      toast({
        title: 'Error',
        description:
          error?.response?.data?.message || 'Failed to reset password',
        variant: 'destructive',
      })
    },
  })
}
