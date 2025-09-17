import Cookies from 'js-cookie'

export interface TokenData {
  accessToken: string | undefined
  refreshToken: string | undefined
}

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set('access_token', accessToken, { expires: 1 }) // 1 day
  Cookies.set('refresh_token', refreshToken, { expires: 7 }) // 7 days
}

export const getAuthTokens = (): TokenData => ({
  accessToken: Cookies.get('access_token'),
  refreshToken: Cookies.get('refresh_token'),
})

export const removeAuthTokens = () => {
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
}

export const hasValidTokens = (): boolean => {
  const { accessToken, refreshToken } = getAuthTokens()
  return !!(accessToken && refreshToken)
}

export const hasRefreshToken = (): boolean => {
  const { refreshToken } = getAuthTokens()
  return !!refreshToken
}
