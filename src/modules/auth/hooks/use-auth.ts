'use client'

import { localApi } from '@/lib/api/config/axios-server'
import { setAuthTokens } from '@/lib/auth/tokens'
import { QUERY_KEYS, ROUTES } from '@/lib/constants'
import { useInitialUser } from '@/lib/providers/user-provider'
import { UserData } from '@/lib/utils'
import {
  createProfile,
  loginByPhone,
  type LoginRequest,
  type LoginResponse,
  logoutUser,
  registerByEmail,
  registerByPhone,
  type User,
  verifyEmail,
  verifyPhoneOtp,
} from '@modules/auth/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useLogin(loginFn?: (request: LoginRequest) => Promise<LoginResponse>) {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: loginFn ?? loginByPhone,
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
      // Debug logs to verify caching in React Query
      try {
        const cached = queryClient.getQueryData(QUERY_KEYS.USER) as User | undefined
        console.log('[useLogin] cached USER?', {
          ok: !!cached,
          has_email: !!cached?.email,
          has_phone: !!cached?.phone,
        })
      } catch (e) {
        console.log('[useLogin] cache read error', e)
      }
      // Optionally cache normalized user_data returned by internal routes/server action
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userData = (data as any)?.json
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

      // Check if there's a saved redirect URL
      const redirectAfterLogin =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('redirectAfterLogin') ||
            document.cookie
              .split('; ')
              .find((row) => row.startsWith('redirectAfterLogin='))
              ?.split('=')[1]
          : null

      if (redirectAfterLogin) {
        // Clear the stored URL from both sessionStorage and cookie
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
      console.error('Login failed:', error)
    },
  })
}

export function useUser() {
  const queryClient = useQueryClient()
  const { user: initialUser } = useInitialUser()
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.USER,
    queryFn: async () => {
      const res = await localApi.get<{ user: User }>('/api/auth/me')
      console.log('[useUser] fetched /api/auth/me', {
        ok: !!res?.user,
        has_email: !!res?.user?.email,
        has_phone: !!res?.user?.phone,
      })
      // Ensure query cache stays in sync
      queryClient.setQueryData(QUERY_KEYS.USER, res.user)
      const cached = queryClient.getQueryData(QUERY_KEYS.USER) as User | undefined
      console.log('[useUser] updated cache USER?', { ok: !!cached })
      return res.user
    },
    initialData: initialUser ?? undefined,
    initialDataUpdatedAt: Date.now(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })

  return {
    data: data as User | undefined,
    isLoading,
    error: (error as Error) ?? null,
  }
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // ลบ user data จาก cache และ localStorage
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER })
      queryClient.clear()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_data')
      }
      // redirect ไปหน้า login
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

export function useAuth() {
  const login = useLogin()
  const logout = useLogout()
  const { data: user, isLoading, error } = useUser()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)

    // Listen for auth refresh events to potentially update user data
    const handleAuthRefresh = () => {
      console.log('[useAuth] Auth refreshed, user data may be stale')
      // The useUser hook will automatically refetch when needed
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:refreshed', handleAuthRefresh)
      return () => window.removeEventListener('auth:refreshed', handleAuthRefresh)
    }
  }, [])

  // User is authenticated if we have user data (httpOnly cookies are managed server-side)
  // The server will handle token validation and refresh automatically
  const isAuthenticated = hasMounted && !!user

  return {
    user: user as User | undefined,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
  }
}

export function useRegisterByEmail() {
  function setCountryCodeCookie(countryCode: string) {
    if (typeof window === 'undefined') return
    document.cookie = `country_code=${encodeURIComponent(countryCode)}; path=/; secure; samesite=strict;`
  }

  return useMutation({
    mutationFn: registerByEmail,
    onSuccess: (data, variables) => {
      console.log('[Debug] Register by email response:', data)
      if (typeof window !== 'undefined') {
        if (data.data?.token) {
          document.cookie = `register_token=${data.data.token}; path=/; secure; samesite=strict;`
        }
        const otpRef = data.data?.otpRef ?? (data.data as { refCode?: string })?.refCode
        if (otpRef) {
          console.log('[Debug] Setting register_otp_ref cookie:', otpRef)
          document.cookie = `register_otp_ref=${otpRef}; path=/; secure; samesite=strict;`
        } else {
          console.warn('[Debug] No otpRef/refCode in registration response')
        }
        if (variables && 'email' in variables && variables.email) {
          document.cookie = `register_email=${encodeURIComponent(variables.email)}; path=/; secure; samesite=strict;`
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

export function useRegisterByPhone() {
  function setCountryCodeCookie(countryCode: string) {
    if (typeof window === 'undefined') return
    document.cookie = `country_code=${encodeURIComponent(countryCode)}; path=/; secure; samesite=strict;`
  }

  return useMutation({
    mutationFn: registerByPhone,
    onSuccess: (data, variables) => {
      console.log('[Debug] Register by phone response:', data)
      if (typeof window !== 'undefined') {
        if (data.data?.token) {
          document.cookie = `register_token=${data.data.token}; path=/; secure; samesite=strict;`
        }
        const otpRef = data.data?.otpRef ?? (data.data as { refCode?: string })?.refCode
        if (otpRef) {
          console.log('[Debug] Setting register_otp_ref cookie:', otpRef)
          document.cookie = `register_otp_ref=${otpRef}; path=/; secure; samesite=strict;`
        } else {
          console.warn('[Debug] No otpRef/refCode in registration response')
        }
        if (variables && 'phone' in variables && variables.phone) {
          document.cookie = `phone=${encodeURIComponent(variables.phone)}; path=/; secure; samesite=strict;`
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

function getRegisterTokenFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(/(?:^|;\s*)register_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : undefined
}

function getRegisterOtpRefFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(/(?:^|;\s*)register_otp_ref=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : undefined
}

export function useVerifyEmail() {
  return useMutation({
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
}
export function useResendEmailOtp() {
  return useMutation({
    mutationFn: async () => {
      const email = getCookie('register_email')
      const country_code = getCookie('country_code')
      if (!email) throw new Error('No register_email found in cookies')
      if (!country_code) throw new Error('No country_code found in cookies')
      // ส่ง email และ country_code
      return registerByEmail({ email, country_code })
    },
    onError: (error) => {
      console.error('Resend OTP (email) failed:', error)
    },
  })
}

export function useResendPhoneOtp() {
  return useMutation({
    mutationFn: async () => {
      const phone = getCookie('phone')
      const country_code = getCookie('country_code')
      if (!phone) throw new Error('No phone found in cookies')
      if (!country_code) throw new Error('No country_code found in cookies')
      // ส่ง phone และ country_code
      return registerByPhone({ phone, country_code })
    },
    onError: (error) => {
      console.error('Resend OTP (phone) failed:', error)
    },
  })
}

export function useVerifyPhoneOtp() {
  return useMutation({
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
}

export function useCreateProfile() {
  return useMutation({
    mutationFn: async (params: { profilename: string; password: string }) => {
      const email = getCookie('register_email')
      const phone = getCookie('phone')
      const token = getCookie('register_token')
      const country_code = getCookie('country_code')

      // ต้องมี token และ country_code เสมอ
      if (!token || !country_code) {
        throw new Error('Missing required information in cookies')
      }

      // ต้องมีอย่างน้อย email หรือ phone
      if (!email && !phone) {
        throw new Error('Missing email or phone in cookies')
      }

      return createProfile({
        email: email || '',
        phone: phone || '',
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
}
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : undefined
}
