import { removeAuthTokens } from '@/lib/auth/tokens'
import { API_ENDPOINTS } from '@/lib/constants'
import { api } from '../../../lib/api/config/axios'

// ---------- Types ----------

export interface LoginRequest {
  phone?: string
  email?: string
  password: string
}

export interface User {
  customer_id: number
  email: string
  phone: string
  profilename: string
  avatar: string | null
  platform_type: string
  company_id: number | null
  team_id: number | null
  device: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface ApiResponse<T> {
  statusCode: number
  data: T
  message: string
}

export interface RegisterByEmailRequest {
  email: string
  country_code: string
}

export interface RegisterByEmailData {
  message: string
  userId: number
  token: string
}

export interface RegisterByEmailResponse {
  statusCode: number
  data: RegisterByEmailData
  message: string
}

export interface VerifyEmailRequest {
  email: string
  otp: string
  token: string
}

export interface VerifyEmailResponse {
  statusCode: number
  message: string
  // เพิ่ม field อื่นๆ ตาม response ที่ backend ส่งกลับ (ถ้ามี)
}

export interface CreateProfileRequest {
  email: string
  country_code: string
  profilename: string
  phone: string
  password: string
  token: string // register_token
}

export interface CreateProfileResponse {
  statusCode: number
  message: string
  // เพิ่ม field อื่นๆ ตาม response ที่ backend ส่งกลับ (ถ้ามี)
}

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

export interface RegisterByPhoneRequest {
  phone: string
  country_code: string
}

export interface RegisterByPhoneData {
  message: string
  userId: number
  token: string
}

export interface RegisterByPhoneResponse {
  statusCode: number
  data: RegisterByPhoneData
  message: string
}

export interface VerifyPhoneOtpRequest {
  phone: string
  otp: string
  token: string
}
// ---------- API Functions ----------

export async function loginByPhone(
  request: LoginRequest,
): Promise<LoginResponse> {
  const result = await api.post<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.AUTH.LOGIN,
    request,
  )
  return result.data
}

export async function registerByEmail(
  request: RegisterByEmailRequest,
): Promise<RegisterByEmailResponse> {
  const result = await api.post<RegisterByEmailResponse>(
    API_ENDPOINTS.AUTH.REGISTER_EMAIL,
    request,
  )
  return result
}

export async function verifyEmail(
  request: VerifyEmailRequest,
): Promise<VerifyEmailResponse> {
  const result = await api.post<VerifyEmailResponse>(
    API_ENDPOINTS.AUTH.VERIFY_EMAIL,
    request,
  )
  return result
}

export async function createProfile(
  request: CreateProfileRequest,
): Promise<CreateProfileResponse> {
  const result = await api.post<CreateProfileResponse>(
    API_ENDPOINTS.AUTH.CREATE_PROFILE,
    request,
  )
  return result
}

export async function refreshToken(): Promise<LoginResponse> {
  const result = await api.get<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.AUTH.REFRESH,
  )
  return result.data
}

export async function logoutUser(): Promise<void> {
  removeAuthTokens()
  if (typeof window !== 'undefined') {
    window.location.href = '/sign-in'
  }
}

export async function getPolicy(): Promise<GetPolicyResponse> {
  const result = await api.get<GetPolicyResponse>(API_ENDPOINTS.AUTH.POLICY)
  return result
}

export async function getTerm(): Promise<GetPolicyResponse> {
  const result = await api.get<GetPolicyResponse>(API_ENDPOINTS.AUTH.TERM)
  return result
}

export async function registerByPhone(
  request: RegisterByPhoneRequest,
): Promise<RegisterByPhoneResponse> {
  const result = await api.post<RegisterByPhoneResponse>(
    API_ENDPOINTS.AUTH.REGISTER_PHONE,
    request,
  )
  return result
}

export interface VerifyPhoneOtpResponse {
  statusCode: number
  message: string
}

export async function verifyPhoneOtp(
  request: VerifyPhoneOtpRequest,
): Promise<VerifyPhoneOtpResponse> {
  const result = await api.post<VerifyPhoneOtpResponse>(
    API_ENDPOINTS.AUTH.VERIFY_PHONE,
    request,
  )
  return result
}
