import type {
  CreateProfileRequest,
  CreateProfileResponse,
} from '@/app/[locale]/(auth)/create-profile/_schemas/create-profile.schema'
import { API_PROXY, ROUTES } from '@/lib/constants'
import { removeAuthTokens } from '@/lib/auth/tokens'
import type {
  SignInInput as LoginRequest,
  LoginResponse,
} from '@/modules/auth/models/sign-in.schema'
import type {
  RegisterByEmailRequest,
  RegisterByEmailResponse,
  RegisterByPhoneRequest,
  RegisterByPhoneResponse,
} from '@/modules/auth/models/sign-up.schema'
import type {
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '@/modules/auth/models/verify-email.schema'
import type {
  VerifyPhoneOtpRequest,
  VerifyPhoneOtpResponse,
} from '@/modules/auth/models/verify-phone.schema'
import { redirect } from 'next/navigation'
import { api, localApi } from '../../../lib/api/config/axios-server'
export type { User } from '@/lib/schemas/user.schema'
export type {
  SignInInput as LoginRequest,
  LoginResponse,
} from '@/modules/auth/models/sign-in.schema'

// ---------- Types ----------
export interface ApiResponse<T> {
  statusCode: number
  data: T
  message: string
}

// Feature-scoped schemas and types
export type {
  CreateProfileRequest,
  CreateProfileResponse,
} from '@/app/[locale]/(auth)/create-profile/_schemas/create-profile.schema'
export type {
  RegisterByEmailRequest,
  RegisterByEmailResponse,
  RegisterByPhoneRequest,
  RegisterByPhoneResponse,
} from '@/modules/auth/models/sign-up.schema'
export type {
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '@/modules/auth/models/verify-email.schema'
export type {
  VerifyPhoneOtpRequest,
  VerifyPhoneOtpResponse,
} from '@/modules/auth/models/verify-phone.schema'

// Sign-up/verify/create-profile types are sourced from feature schemas

export interface PolicyDescription {
  id: number
  languageId: number
  policyId: number
  name: string
  detail: string
  createdAt: string
  createdBy: number
  updatedAt: string | null
  updatedBy: number | null
  policy_id: number
}

export interface Policy {
  id: number
  name: string
  version: string
  slug: string
  status: number
  deletedAt: string | null
  createdAt: string
  createdBy: number
  updatedAt: string | null
  updatedBy: number | null
  descriptions: PolicyDescription[]
}

export interface GetPolicyResponse {
  statusCode: number
  data: Policy[]
  message: string
}

// See feature schema for phone verify types
// ---------- API Functions ----------

export async function loginByPhone(request: LoginRequest): Promise<LoginResponse> {
  // Route through Next.js internal API to keep httpOnly cookies
  const result = await localApi.post<LoginResponse>(API_PROXY.AUTH.SIGN_IN_EMAIL, request)
  return result
}

export async function registerByEmail(
  request: RegisterByEmailRequest,
): Promise<RegisterByEmailResponse> {
  const result = await localApi.post<RegisterByEmailResponse>(API_PROXY.AUTH.SIGN_UP_EMAIL, request)
  return result
}

export async function registerByPhone(
  request: RegisterByPhoneRequest,
): Promise<RegisterByPhoneResponse> {
  const result = await localApi.post<RegisterByPhoneResponse>(API_PROXY.AUTH.SIGN_UP_PHONE, request)
  return result
}
export async function verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
  const result = await localApi.post<VerifyEmailResponse>(API_PROXY.AUTH.VERIFY_EMAIL, request)
  return result
}

// See feature schema for phone verify response type

export async function verifyPhoneOtp(
  request: VerifyPhoneOtpRequest,
): Promise<VerifyPhoneOtpResponse> {
  const result = await localApi.post<VerifyPhoneOtpResponse>(API_PROXY.AUTH.VERIFY_PHONE, request)
  return result
}
export async function createProfile(request: CreateProfileRequest): Promise<CreateProfileResponse> {
  const result = await localApi.post<CreateProfileResponse>(API_PROXY.AUTH.CREATE_PROFILE, request)
  return result
}

export async function refreshToken(): Promise<LoginResponse> {
  const result = await localApi.get<LoginResponse>(API_PROXY.AUTH.REFRESH)
  return result
}

export async function logoutUser(): Promise<void> {
  try {
    await localApi.post(API_PROXY.AUTH.SIGN_OUT)
  } catch (e) {
    // ignore, ensure client tokens cleared anyway
    console.warn('Local sign-out failed, clearing client tokens', e)
  }

  if (typeof window !== 'undefined') {
    try {
      removeAuthTokens()
    } catch (error) {
      console.warn('Failed to clear client auth cookies', error)
    }
  }

  if (typeof window !== 'undefined') {
    redirect(ROUTES.SIGN_IN)
  }
}

export async function getPolicy(): Promise<GetPolicyResponse> {
  const result = await api.get<GetPolicyResponse>(API_PROXY.AUTH.POLICY)
  return result
}

export async function getTerm(): Promise<GetPolicyResponse> {
  const result = await api.get<GetPolicyResponse>(API_PROXY.AUTH.TERM)
  return result
}
