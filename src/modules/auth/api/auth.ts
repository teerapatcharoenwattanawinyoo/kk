import { removeAuthTokens } from '@/lib/auth/tokens'
import { API_ENDPOINTS } from '@/lib/constants'
import { api } from '../../../lib/api/config/axios'

import {
  createProfileRequestSchema,
  createProfileResponseSchema,
  getPolicyResponseSchema,
  loginApiResponseSchema,
  loginRequestSchema,
  registerByEmailRequestSchema,
  registerByEmailResponseSchema,
  registerByPhoneRequestSchema,
  registerByPhoneResponseSchema,
  verifyEmailRequestSchema,
  verifyEmailResponseSchema,
  verifyPhoneOtpRequestSchema,
  type CreateProfileRequest,
  type CreateProfileResponse,
  type GetPolicyResponse,
  type LoginApiResponse,
  type LoginRequest,
  type LoginResponse,
  type RegisterByEmailRequest,
  type RegisterByEmailResponse,
  type RegisterByPhoneRequest,
  type RegisterByPhoneResponse,
  type VerifyEmailRequest,
  type VerifyEmailResponse,
  type VerifyPhoneOtpRequest,
} from '../schemas'

export type { User } from '../schemas'

export async function loginByPhone(request: LoginRequest): Promise<LoginResponse> {
  const payload = loginRequestSchema.parse(request)
  const response = await api.post<LoginApiResponse>(API_ENDPOINTS.AUTH.LOGIN, payload)
  return loginApiResponseSchema.parse(response).data
}

export async function registerByEmail(
  request: RegisterByEmailRequest,
): Promise<RegisterByEmailResponse> {
  const payload = registerByEmailRequestSchema.parse(request)
  const response = await api.post<RegisterByEmailResponse>(
    API_ENDPOINTS.AUTH.REGISTER_EMAIL,
    payload,
  )
  return registerByEmailResponseSchema.parse(response)
}

export async function verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
  const payload = verifyEmailRequestSchema.parse(request)
  const response = await api.post<VerifyEmailResponse>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, payload)
  return verifyEmailResponseSchema.parse(response)
}

export async function createProfile(request: CreateProfileRequest): Promise<CreateProfileResponse> {
  const payload = createProfileRequestSchema.parse(request)
  const response = await api.post<CreateProfileResponse>(API_ENDPOINTS.AUTH.CREATE_PROFILE, payload)
  return createProfileResponseSchema.parse(response)
}

export async function refreshToken(): Promise<LoginResponse> {
  const response = await api.get<LoginApiResponse>(API_ENDPOINTS.AUTH.REFRESH)
  return loginApiResponseSchema.parse(response).data
}

export async function logoutUser(): Promise<void> {
  removeAuthTokens()
  if (typeof window !== 'undefined') {
    window.location.href = '/sign-in'
  }
}

export async function getPolicy(): Promise<GetPolicyResponse> {
  const response = await api.get<GetPolicyResponse>(API_ENDPOINTS.AUTH.POLICY)
  return getPolicyResponseSchema.parse(response)
}

export async function getTerm(): Promise<GetPolicyResponse> {
  const response = await api.get<GetPolicyResponse>(API_ENDPOINTS.AUTH.TERM)
  return getPolicyResponseSchema.parse(response)
}

export async function registerByPhone(
  request: RegisterByPhoneRequest,
): Promise<RegisterByPhoneResponse> {
  const payload = registerByPhoneRequestSchema.parse(request)
  const response = await api.post<RegisterByPhoneResponse>(
    API_ENDPOINTS.AUTH.REGISTER_PHONE,
    payload,
  )
  return registerByPhoneResponseSchema.parse(response)
}

export async function verifyPhoneOtp(request: VerifyPhoneOtpRequest): Promise<unknown> {
  const payload = verifyPhoneOtpRequestSchema.parse(request)
  return api.post(API_ENDPOINTS.AUTH.VERIFY_PHONE, payload)
}
