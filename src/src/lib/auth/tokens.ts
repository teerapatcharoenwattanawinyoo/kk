import { COOKIE_KEYS } from '@/lib/constants'
import Cookies from 'js-cookie'

const CLIENT_ACCESS_TOKEN_KEY = COOKIE_KEYS.CLIENT_ACCESS_TOKEN
const CLIENT_REFRESH_TOKEN_KEY = COOKIE_KEYS.CLIENT_REFRESH_TOKEN

export interface TokenData {
  accessToken: string | undefined
  refreshToken: string | undefined
}

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  const secure = process.env.NODE_ENV === 'production'
  const baseOptions = {
    sameSite: 'lax' as const,
    path: '/',
    secure,
  }
  Cookies.set(CLIENT_ACCESS_TOKEN_KEY, accessToken, {
    expires: 1, // 1 day
    ...baseOptions,
  })
  Cookies.set(CLIENT_REFRESH_TOKEN_KEY, refreshToken, {
    expires: 7, // 7 days
    ...baseOptions,
  })
}

export const getAuthTokens = (): TokenData => ({
  accessToken: Cookies.get(CLIENT_ACCESS_TOKEN_KEY),
  refreshToken: Cookies.get(CLIENT_REFRESH_TOKEN_KEY),
})

export const removeAuthTokens = () => {
  Cookies.remove(CLIENT_ACCESS_TOKEN_KEY, { path: '/' })
  Cookies.remove(CLIENT_REFRESH_TOKEN_KEY, { path: '/' })
}

export const hasValidTokens = (): boolean => {
  const { accessToken, refreshToken } = getAuthTokens()
  return !!(accessToken && refreshToken)
}

export const hasRefreshToken = (): boolean => {
  const { refreshToken } = getAuthTokens()
  return !!refreshToken
}
