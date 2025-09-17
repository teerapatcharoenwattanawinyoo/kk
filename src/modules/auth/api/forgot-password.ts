import { API_ENDPOINTS } from '@/lib/constants'
import { api } from '../../../lib/api/config/axios'
import { IResponse } from '../../../lib/api/config/model'

import {
  forgotPasswordEmailRequestSchema,
  forgotPasswordPhoneRequestSchema,
  forgotPasswordResponseSchema,
  resetPasswordRequestSchema,
  resetPasswordResponseSchema,
  verifyEmailRequestSchema,
  verifyOtpResponseSchema,
  verifyPhoneOtpRequestSchema,
  type ForgotPasswordEmailRequest,
  type ForgotPasswordPhoneRequest,
  type ForgotPasswordResponse,
  type ResetPasswordRequest,
  type ResetPasswordResponse,
  type VerifyEmailRequest,
  type VerifyOtpResponse,
  type VerifyPhoneOtpRequest,
} from '../schemas'

export type {
  ForgotPasswordEmailRequest,
  ForgotPasswordPhoneRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyOtpResponse,
  VerifyPhoneOtpRequest,
}

export const forgotPasswordApi = async (
  data: ForgotPasswordEmailRequest | ForgotPasswordPhoneRequest,
): Promise<IResponse<ForgotPasswordResponse>> => {
  const payload =
    'email' in data
      ? forgotPasswordEmailRequestSchema.parse(data)
      : forgotPasswordPhoneRequestSchema.parse(data)

  const response = await api.post<IResponse<ForgotPasswordResponse>>(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    payload,
  )

  return {
    ...response,
    data: forgotPasswordResponseSchema.parse(response.data),
  }
}

export const verifyEmailOTPApi = async (
  data: VerifyEmailRequest,
): Promise<IResponse<VerifyOtpResponse>> => {
  const payload = verifyEmailRequestSchema.parse(data)
  const response = await api.post<IResponse<VerifyOtpResponse>>(
    API_ENDPOINTS.AUTH.VERIFY_EMAIL,
    payload,
  )

  return {
    ...response,
    data: verifyOtpResponseSchema.parse(response.data),
  }
}

export const verifyPhoneOTPApi = async (
  data: VerifyPhoneOtpRequest,
): Promise<IResponse<VerifyOtpResponse>> => {
  const payload = verifyPhoneOtpRequestSchema.parse(data)
  const response = await api.post<IResponse<VerifyOtpResponse>>(
    API_ENDPOINTS.AUTH.VERIFY_PHONE,
    payload,
  )

  return {
    ...response,
    data: verifyOtpResponseSchema.parse(response.data),
  }
}

export const resetPasswordApi = async (
  data: ResetPasswordRequest,
): Promise<IResponse<ResetPasswordResponse>> => {
  const payload = resetPasswordRequestSchema.parse(data)
  const response = await api.post<IResponse<ResetPasswordResponse>>(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    payload,
  )

  return {
    ...response,
    data: resetPasswordResponseSchema.parse(response.data),
  }
}
