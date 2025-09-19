import { localApi } from '../../../lib/api/config/axios-server'
import { IResponse } from '../../../lib/api/config/model'
export type {
  ForgotPasswordEmailRequest,
  ForgotPasswordPhoneRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  VerifyEmailOTPRequest,
  VerifyOTPResponse,
  VerifyPhoneOTPRequest,
} from '@/modules/auth/models/forgot-password.schema'

// API Functions (via internal routes)
export const forgotPasswordApi = async (data: {
  email?: string
  phone?: string
}): Promise<IResponse<{ token: string; message: string }>> => {
  return localApi.post('/api/auth/forgot-password', data)
}

export const verifyEmailOTPApi = async (data: {
  email: string
  otp: string
  token: string
}): Promise<IResponse<{ token: string; message: string }>> => {
  return localApi.post('/api/auth/verify-email', data)
}

export const verifyPhoneOTPApi = async (data: {
  phone: string
  otp: string
  token: string
}): Promise<IResponse<{ token: string; message: string }>> => {
  return localApi.post('/api/auth/verify-phone', data)
}

export const resetPasswordApi = async (data: {
  token: string
  newPassword: string
}): Promise<IResponse<{ message: string }>> => {
  return localApi.post('/api/auth/reset-password', data)
}
