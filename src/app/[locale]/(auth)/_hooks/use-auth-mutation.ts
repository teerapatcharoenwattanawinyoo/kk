'use client'

import {
  createProfile,
  loginByPhone,
  type LoginRequest,
  type LoginResponse,
  logoutUser,
  registerByEmail,
  registerByPhone,
  verifyEmail,
  verifyPhoneOtp,
} from '@/app/[locale]/(auth)/_services'
import { setAuthTokens } from '@/lib/auth/tokens'
import { QUERY_KEYS, ROUTES } from '@/lib/constants'
import type { User } from '@/lib/schemas/user.schema'
import { AppError, normalizeError } from '@/lib/errors/app-error'
import { UserData } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

const AUTH_ERROR_NORMALIZER_OPTIONS = {
  fallbackReason: 'UNKNOWN' as const,
  translationOverrides: {
    INVALID_CREDENTIALS: 'auth.errors.invalid_credentials',
    NETWORK: 'auth.errors.network',
    TIMEOUT: 'auth.errors.network',
    UNKNOWN: 'auth.errors.generic',
    SERVER: 'auth.errors.generic',
    BAD_REQUEST: 'auth.errors.generic',
    VALIDATION: 'auth.errors.generic',
  },
  statusReasonMap: {
    400: 'INVALID_CREDENTIALS',
    401: 'INVALID_CREDENTIALS',
    403: 'INVALID_CREDENTIALS',
    422: 'VALIDATION',
  } as const,
  messageMatchers: [
    {
      includes: ['invalid otp', 'otp'],
      reason: 'VALIDATION' as const,
    },
    {
      includes: ['invalid', 'wrong password', 'incorrect'],
      reason: 'INVALID_CREDENTIALS' as const,
    },
  ],
}

const useLogin = (loginFn?: (request: LoginRequest) => Promise<LoginResponse>) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation<LoginResponse, AppError, LoginRequest>({
    mutationFn: async (variables) => {
      const executor = loginFn ?? loginByPhone
      try {
        return await executor(variables)
      } catch (error) {
        const friendlyError = normalizeError(error, AUTH_ERROR_NORMALIZER_OPTIONS)
        console.error('[useLogin] mutation failed', {
          originalError: error,
          reason: friendlyError.reason,
        })
        throw friendlyError
      }
    },
    onSuccess: (data) => {
      const accessToken = (data as LoginResponse)?.access_token
      const refreshToken = (data as LoginResponse)?.refresh_token

      if (typeof window !== 'undefined' && accessToken && refreshToken) {
        try {
          setAuthTokens(accessToken, refreshToken)
        } catch (error) {
          console.error('[useLogin] failed to persist client tokens', error)
        }
      }

      queryClient.setQueryData(QUERY_KEYS.USER, data.user)
      try {
        const cached = queryClient.getQueryData(QUERY_KEYS.USER) as User | undefined
        console.log('[useLogin] cached USER?', {
          ok: !!cached,
          has_email: !!cached?.email,
          has_phone: !!cached?.phone,
        })
      } catch (error) {
        console.log('[useLogin] cache read error', error)
      }

      const userData =
        typeof data === 'object' && data !== null && 'json' in data
          ? (data as { json?: UserData['user'] | null }).json
          : undefined
      if (userData) {
        console.log('[useLogin] caching user_data into react-query')
        if (typeof window !== 'undefined') {
          const user: UserData = {
            user: userData,
            timestamp: Date.now(),
          }
          localStorage.setItem('user_data', JSON.stringify(user))
        }
        queryClient.setQueryData(QUERY_KEYS.USER_DATA, userData)
        const cachedUserData = queryClient.getQueryData(QUERY_KEYS.USER_DATA)
        console.log('[useLogin] cached USER_DATA?', { ok: !!cachedUserData })
      }

      const redirectAfterLogin =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('redirectAfterLogin') ||
            document.cookie
              .split('; ')
              .find((row) => row.startsWith('redirectAfterLogin='))
              ?.split('=')[1]
          : null

      if (redirectAfterLogin) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('redirectAfterLogin')
          document.cookie = 'redirectAfterLogin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        }
        router.push(decodeURIComponent(redirectAfterLogin))
      } else {
        router.push(ROUTES.DASHBOARD)
      }
    },
    onError: (error) => {
      console.error('[useLogin] sanitized error emitted', {
        reason: error.reason,
        translationKey: error.translationKey,
      })
    },
  })
}

const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER })
      queryClient.clear()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_data')
      }
      router.push(ROUTES.SIGN_IN)
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      queryClient.clear()

      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_data')
      }

      router.push(ROUTES.SIGN_IN)
    },
  })
}

const COOKIE_MAX_AGE = 60 * 15 // 15 minutes

const writeClientCookie = (name: string, value: string, maxAge: number = COOKIE_MAX_AGE) => {
  if (typeof window === 'undefined') return
  const parts = [`path=/`, `Max-Age=${maxAge}`, `SameSite=Strict`]
  if (window.location.protocol === 'https:') {
    parts.push('Secure')
  }
  document.cookie = `${name}=${encodeURIComponent(value)}; ${parts.join('; ')}`
}

const useRegisterByEmail = () => {
  const setCountryCodeCookie = (countryCode: string) => {
    writeClientCookie('country_code', countryCode)
  }

  return useMutation({
    mutationFn: registerByEmail,
    onSuccess: (data, variables) => {
      console.log('[Debug] Register by email response:', data)
      if (typeof window !== 'undefined') {
        if (data.data?.token) {
          writeClientCookie('register_token', data.data.token)
        }
        const otpRef = data.data?.otpRef ?? (data.data as { refCode?: string })?.refCode
        if (otpRef) {
          console.log('[Debug] Setting register_otp_ref cookie:', otpRef)
          writeClientCookie('register_otp_ref', otpRef)
        } else {
          console.warn('[Debug] No otpRef/refCode in registration response')
        }
        if (variables && 'email' in variables && variables.email) {
          writeClientCookie('register_email', variables.email)
        }
        if (variables && 'country_code' in variables && variables.country_code) {
          setCountryCodeCookie(variables.country_code as string)
        }
      }
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    },
  })
}

const useRegisterByPhone = () => {
  const setCountryCodeCookie = (countryCode: string) => {
    writeClientCookie('country_code', countryCode)
  }

  return useMutation({
    mutationFn: registerByPhone,
    onSuccess: (data, variables) => {
      console.log('[Debug] Register by phone response:', data)
      if (typeof window !== 'undefined') {
        if (data.data?.token) {
          writeClientCookie('register_token', data.data.token)
        }
        const otpRef = data.data?.otpRef ?? (data.data as { refCode?: string })?.refCode
        if (otpRef) {
          console.log('[Debug] Setting register_otp_ref cookie:', otpRef)
          writeClientCookie('register_otp_ref', otpRef)
        } else {
          console.warn('[Debug] No otpRef/refCode in registration response')
        }
        if (variables && 'phone' in variables && variables.phone) {
          writeClientCookie('phone', variables.phone)
        }
        if (variables && 'country_code' in variables && variables.country_code) {
          setCountryCodeCookie(variables.country_code as string)
        }
      }
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    },
  })
}

const getRegisterTokenFromCookie = (): string | undefined => {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(/(?:^|;\s*)register_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : undefined
}

const getRegisterOtpRefFromCookie = (): string | undefined => {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(/(?:^|;\s*)register_otp_ref=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : undefined
}

const useVerifyEmail = () =>
  useMutation({
    mutationFn: async (params: { email: string; otp: string }) => {
      const token = getRegisterTokenFromCookie()
      const otpRef = getRegisterOtpRefFromCookie()
      if (!token) throw new Error('No register_token found in cookies')
      if (!otpRef) throw new Error('No register_otp_ref found in cookies')
      return verifyEmail({
        email: params.email,
        otp: params.otp,
        token,
        otpRef,
      })
    },
  })

const useResendEmailOtp = () =>
  useMutation({
    mutationFn: async () => {
      const email = getCookie('register_email')
      const country_code = getCookie('country_code')
      if (!email) throw new Error('No register_email found in cookies')
      if (!country_code) throw new Error('No country_code found in cookies')
      return registerByEmail({ email, country_code })
    },
    onError: (error) => {
      console.error('Resend OTP (email) failed:', error)
    },
  })

const useResendPhoneOtp = () =>
  useMutation({
    mutationFn: async () => {
      const phone = getCookie('phone')
      const country_code = getCookie('country_code')
      if (!phone) throw new Error('No phone found in cookies')
      if (!country_code) throw new Error('No country_code found in cookies')
      return registerByPhone({ phone, country_code })
    },
    onError: (error) => {
      console.error('Resend OTP (phone) failed:', error)
    },
  })

const useVerifyPhoneOtp = () =>
  useMutation({
    mutationFn: async (params: { otp: string }) => {
      const phone = getCookie('phone')
      const token = getCookie('register_token')
      const otpRef = getCookie('register_otp_ref')
      if (!phone || !token || !otpRef)
        throw new Error('Missing phone, register_token or register_otp_ref in cookies')
      return verifyPhoneOtp({
        phone,
        otp: params.otp,
        token,
        otpRef,
      })
    },
  })

const useCreateProfile = () =>
  useMutation({
    mutationFn: async (params: { profilename: string; password: string }) => {
      const email = getCookie('register_email')
      const phone = getCookie('phone')
      const token = getCookie('register_token')
      const country_code = getCookie('country_code')

      if (!token || !country_code) {
        throw new Error('Missing required information in cookies')
      }

      if (!email && !phone) {
        throw new Error('Missing email or phone in cookies')
      }

      return createProfile({
        email: email ?? undefined,
        phone: phone ?? undefined,
        country_code,
        profilename: params.profilename,
        password: params.password,
        token,
      })
    },
    onSuccess: () => {
      if (typeof document !== 'undefined') {
        document.cookie = 'register_email=; path=/; Max-Age=0'
        document.cookie = 'register_token=; path=/; Max-Age=0'
        document.cookie = 'country_code=; path=/; Max-Age=0'
        document.cookie = 'phone=; path=/; Max-Age=0'
      }
    },
  })

const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : undefined
}

export {
  useCreateProfile,
  useLogin,
  useLogout,
  useRegisterByEmail,
  useRegisterByPhone,
  useResendEmailOtp,
  useResendPhoneOtp,
  useVerifyEmail,
  useVerifyPhoneOtp,
}

export type { LoginRequest, LoginResponse }
