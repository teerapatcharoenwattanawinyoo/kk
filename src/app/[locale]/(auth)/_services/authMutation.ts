import {
  CreateProfileRequestSchema,
  type CreateProfileRequest,
  type CreateProfileResponse,
} from '@/app/[locale]/(auth)/_schemas/create-profile.schema'
import {
  SignInSchema,
  type SignInInput as LoginRequest,
  type LoginResponse,
} from '@/app/[locale]/(auth)/_schemas/sign-in.schema'
import {
  RegisterByEmailRequestSchema,
  RegisterByPhoneRequestSchema,
  type RegisterByEmailRequest,
  type RegisterByEmailResponse,
  type RegisterByPhoneRequest,
  type RegisterByPhoneResponse,
} from '@/app/[locale]/(auth)/_schemas/sign-up.schema'
import {
  VerifyEmailRequestSchema,
  type VerifyEmailRequest,
  type VerifyEmailResponse,
} from '@/app/[locale]/(auth)/_schemas/verify-email.schema'
import {
  VerifyPhoneRequestSchema,
  type VerifyPhoneOtpRequest,
  type VerifyPhoneOtpResponse,
} from '@/app/[locale]/(auth)/_schemas/verify-phone.schema'
import { localApi } from '@/lib/api/config/axios-server'
import { removeAuthTokens } from '@/lib/auth/tokens'
import { API_PROXY } from '@/lib/constants'

const loginByPhone = async (request: LoginRequest): Promise<LoginResponse> => {
  try {
    const payload = SignInSchema.parse(request)
    return await localApi.post<LoginResponse>(API_PROXY.AUTH.SIGN_IN_EMAIL, payload)
  } catch (error) {
    console.log('loginByPhone', error, {
      hasEmail: !!request.email,
      hasPhone: !!request.phone,
    })
    throw error instanceof Error ? error : new Error('Failed to login')
  }
}

const registerByEmail = async (
  request: RegisterByEmailRequest,
): Promise<RegisterByEmailResponse> => {
  try {
    const payload = RegisterByEmailRequestSchema.parse(request)
    return await localApi.post<RegisterByEmailResponse>(API_PROXY.AUTH.SIGN_UP_EMAIL, payload)
  } catch (error) {
    console.log('registerByEmail', error, {
      hasEmail: !!request.email,
      hasCountryCode: !!request.country_code,
    })
    throw error instanceof Error ? error : new Error('Failed to register by email')
  }
}

const registerByPhone = async (
  request: RegisterByPhoneRequest,
): Promise<RegisterByPhoneResponse> => {
  try {
    const payload = RegisterByPhoneRequestSchema.parse(request)
    return await localApi.post<RegisterByPhoneResponse>(API_PROXY.AUTH.SIGN_UP_PHONE, payload)
  } catch (error) {
    console.log('registerByPhone', error, {
      hasPhone: !!request.phone,
      hasCountryCode: !!request.country_code,
    })
    throw error instanceof Error ? error : new Error('Failed to register by phone')
  }
}

const verifyEmail = async (request: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
  try {
    const payload = VerifyEmailRequestSchema.parse(request)
    return await localApi.post<VerifyEmailResponse>(API_PROXY.AUTH.VERIFY_EMAIL, payload)
  } catch (error) {
    console.log('verifyEmail', error, { hasEmail: !!request.email })
    throw error instanceof Error ? error : new Error('Failed to verify email')
  }
}

const verifyPhoneOtp = async (request: VerifyPhoneOtpRequest): Promise<VerifyPhoneOtpResponse> => {
  try {
    const payload = VerifyPhoneRequestSchema.parse(request)
    return await localApi.post<VerifyPhoneOtpResponse>(API_PROXY.AUTH.VERIFY_PHONE, payload)
  } catch (error) {
    console.log('verifyPhoneOtp', error, { hasPhone: !!request.phone })
    throw error instanceof Error ? error : new Error('Failed to verify phone OTP')
  }
}

const createProfile = async (request: CreateProfileRequest): Promise<CreateProfileResponse> => {
  try {
    const payload = CreateProfileRequestSchema.parse(request)
    return await localApi.post<CreateProfileResponse>(API_PROXY.AUTH.CREATE_PROFILE, payload)
  } catch (error) {
    console.log('createProfile', error, {
      hasEmail: !!request.email,
      hasPhone: !!request.phone,
    })
    throw error instanceof Error ? error : new Error('Failed to create profile')
  }
}

const refreshToken = async (): Promise<LoginResponse> => {
  try {
    return await localApi.get<LoginResponse>(API_PROXY.AUTH.REFRESH)
  } catch (error) {
    console.log('refreshToken', error)
    throw error instanceof Error ? error : new Error('Failed to refresh token')
  }
}

const logoutUser = async (): Promise<void> => {
  try {
    await localApi.post(API_PROXY.AUTH.SIGN_OUT)
  } catch (error) {
    console.log('logoutUser', error)
  } finally {
    if (typeof window !== 'undefined') {
      try {
        removeAuthTokens()
      } catch (tokenError) {
        console.warn('[AuthMutation] logoutUser: failed to clear client tokens', tokenError)
      }
    }
  }
}

export {
  createProfile,
  loginByPhone,
  logoutUser,
  refreshToken,
  registerByEmail,
  registerByPhone,
  verifyEmail,
  verifyPhoneOtp,
}

export type {
  CreateProfileRequest,
  CreateProfileResponse,
  LoginRequest,
  LoginResponse,
  RegisterByEmailRequest,
  RegisterByEmailResponse,
  RegisterByPhoneRequest,
  RegisterByPhoneResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyPhoneOtpRequest,
  VerifyPhoneOtpResponse,
}
