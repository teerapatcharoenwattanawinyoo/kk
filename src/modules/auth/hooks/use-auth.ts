import { getAuthTokens, removeAuthTokens, setAuthTokens } from '@/lib/auth/tokens'
import { QUERY_KEYS, ROUTES } from '@/lib/constants'
import { buildLocalizedPath } from '@/lib/helpers/localized-path'
import { useI18n } from '@/lib/i18n'
import {
  createProfile,
  loginByPhone,
  logoutUser,
  registerByEmail,
  registerByPhone,
  type User,
  verifyEmail,
  verifyPhoneOtp,
} from '@modules/auth/api/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { locale } = useI18n()

  return useMutation({
    mutationFn: loginByPhone,
    onSuccess: (data) => {
      setAuthTokens(data.access_token, data.refresh_token)

      queryClient.setQueryData(QUERY_KEYS.USER, data.user)

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
        router.push(buildLocalizedPath(locale, ROUTES.DASHBOARD))
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

export function useUser() {
  const queryClient = useQueryClient()
  const [hasMounted, setHasMounted] = useState(false)
  const router = useRouter()

  // ดึงข้อมูล user จาก React Query cache
  const cachedUser = queryClient.getQueryData<User>(QUERY_KEYS.USER)

  useEffect(() => {
    setHasMounted(true)

    // หลัง mount ถ้าไม่มี cache ให้ลองดึงจาก localStorage
    if (!cachedUser && typeof window !== 'undefined') {
      const savedData = localStorage.getItem('user_data')
      if (savedData) {
        try {
          const { user, timestamp } = JSON.parse(savedData)

          // ตรวจสอบว่าข้อมูลหมดอายุหรือไม่ (7 วัน)
          const isExpired = Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000

          if (!isExpired && user) {
            queryClient.setQueryData(QUERY_KEYS.USER, user)
          } else {
            // ลบข้อมูลที่หมดอายุ
            localStorage.removeItem('user_data')
          }
        } catch (error) {
          console.error('Failed to restore user data:', error)
          localStorage.removeItem('user_data')
        }
      }
    }
  }, [cachedUser, queryClient, router])

  // เก็บ user data ใน localStorage พร้อม timestamp
  useEffect(() => {
    if (cachedUser && typeof window !== 'undefined') {
      const dataWithTimestamp = {
        user: cachedUser,
        timestamp: Date.now(),
      }
      localStorage.setItem('user_data', JSON.stringify(dataWithTimestamp))
    }
  }, [cachedUser])

  return {
    data: cachedUser as User | undefined,
    isLoading: hasMounted ? false : true,
    error: null,
  }
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { locale } = useI18n()

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // ลบ tokens
      removeAuthTokens()
      // ลบ user data จาก cache และ localStorage
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER })
      queryClient.clear()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_data')
      }
      // redirect ไปหน้า login
      router.push(buildLocalizedPath(locale, ROUTES.SIGN_IN))
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      removeAuthTokens()
      queryClient.clear()

      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_data')
      }

      router.push(buildLocalizedPath(locale, ROUTES.SIGN_IN))
    },
  })
}

export function useAuth() {
  const login = useLogin()
  const logout = useLogout()
  const { data: user, isLoading, error } = useUser()
  const [hasMounted, setHasMounted] = useState(false)
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    setHasMounted(true)

    // ตรวจสอบ refresh token ในฝั่ง client
    if (typeof window !== 'undefined') {
      const { refreshToken } = getAuthTokens()
      setHasToken(!!refreshToken)
    }
  }, [])

  // ผู้ใช้จะถือว่า authenticated ถ้ามี user ข้อมูลหรือมี refresh token ที่ยังไม่หมดอายุ
  const isAuthenticated = hasMounted && (!!user || hasToken)

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
      console.log('Registration successful:', data)

      if (typeof window !== 'undefined') {
        if (data.data?.token) {
          document.cookie = `register_token=${data.data.token}; path=/; secure; samesite=strict;`
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
      console.log('Registration successful:', data)

      if (typeof window !== 'undefined') {
        if (data.data?.token) {
          document.cookie = `register_token=${data.data.token}; path=/; secure; samesite=strict;`
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

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (params: { email: string; otp: string }) => {
      const token = getRegisterTokenFromCookie()
      if (!token) throw new Error('No register_token found in cookies')
      return verifyEmail({
        email: params.email,
        otp: params.otp,
        token,
      })
    },
  })
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : undefined
}

export function useVerifyPhoneOtp() {
  return useMutation({
    mutationFn: async (params: { otp: string }) => {
      const phone = getCookie('phone')
      const token = getCookie('register_token')
      if (!phone || !token) throw new Error('Missing phone or register_token in cookies')
      return verifyPhoneOtp({
        phone,
        otp: params.otp,
        token,
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
