import { API_BASE_URL } from '@/lib/constants'
import { getCurrentLanguage, getLanguageId } from '@/lib/utils/language'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Get authentication headers from cookies (server-side only)
 */
async function getAuthHeaders() {
  try {
    if (typeof window !== 'undefined') {
      return {}
    }
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    const cookieString = allCookies
      .map((cookie: any) => `${cookie.name}=${cookie.value}`)
      .join('; ')

    const accessTokenCookie = allCookies.find((cookie: any) => cookie.name === 'access_token')
    const accessToken = accessTokenCookie?.value

    return {
      ...(cookieString && { Cookie: cookieString }),
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    }
  } catch (error) {
    console.error('Error getting auth headers:', error)
    return {}
  }
}

/**
 * Get refresh token headers for token refresh requests (server-side only)
 */
async function getRefreshHeaders() {
  try {
    if (typeof window !== 'undefined') {
      return {}
    }
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const refreshTokenCookie = cookieStore.get('refresh_token')

    const allCookies = cookieStore.getAll()
    const cookieString = allCookies
      .map((cookie: any) => `${cookie.name}=${cookie.value}`)
      .join('; ')

    return {
      ...(cookieString ? { Cookie: cookieString } : {}),
      ...(refreshTokenCookie?.value ? { Authorization: `Bearer ${refreshTokenCookie.value}` } : {}),
    }
  } catch (error) {
    console.error('Error getting refresh token from cookies:', error)
    return {}
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include httpOnly cookies
})

// Local API client for calling Next.js route handlers (relative paths)
const localApiClient: AxiosInstance = axios.create({
  // For local Next.js API routes, use no baseURL (relative paths) in browser
  // For server-side, try different approaches to reach localhost
  baseURL:
    typeof window === 'undefined'
      ? process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'
      : undefined,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include httpOnly cookies
})

apiClient.interceptors.request.use(
  async (config) => {
    const currentLang = getCurrentLanguage()
    const langId = getLanguageId(currentLang)

    if (config.headers) {
      // Set language header based on current language
      config.headers['lang-id'] = String(langId ?? '1')

      // Add authentication headers only on server-side
      if (typeof window === 'undefined') {
        const authHeaders = await getAuthHeaders()
        Object.assign(config.headers, authHeaders)
      }
    }

    // ลบ Content-Type header สำหรับ FormData เพื่อให้ browser จัดการเอง
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type']
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Local API client doesn't need access token in Authorization header since it uses httpOnly cookies
localApiClient.interceptors.request.use(
  (config) => {
    const currentLang = getCurrentLanguage()
    const langId = getLanguageId(currentLang)

    if (config.headers) {
      config.headers['lang-id'] = String(langId ?? '1')
    }

    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type']
    }

    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: any) => {
    const originalRequest = error.config

    // ตรวจสอบว่าเป็น 401/403 (invalid token error as shown in step 6 of the diagram)
    // และยังไม่เคย retry และไม่ใช่ refresh token endpoint
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url?.endsWith('/auth/refresh-token')
    ) {
      originalRequest._retry = true

      try {
        // Step 7: Refresh token request to authorization server
        // For server-side, include refresh_token from cookies
        const refreshHeaders = await getRefreshHeaders()

        console.log('[AxiosServer] apiClient -> refresh start', {
          url: '/api/auth/refresh',
          hasCookieHeader: Boolean((refreshHeaders as any)?.Cookie),
          hasAuthHeader: Boolean((refreshHeaders as any)?.Authorization),
          originalUrl: originalRequest?.url,
        })

        const refreshResponse = await localApiClient.get('/api/auth/refresh', {
          headers: refreshHeaders,
        })

        console.log('[AxiosServer] apiClient -> refresh success', {
          status: refreshResponse?.status,
          originalUrl: originalRequest?.url,
        })

        if (refreshResponse) {
          // Step 8: New access token and refresh token received
          // The httpOnly cookies are automatically updated by the server
          // Retry the original request with the new tokens (automatically included in cookies)
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // If refresh fails, redirect to sign-in (re-authorization)
        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in'
        } else {
          // Server-side redirect
          try {
            const { cookies } = await import('next/headers')
            const { redirect } = await import('next/navigation')
            const cookieStore = await cookies()

            cookieStore.delete('access_token')
            cookieStore.delete('refresh_token')

            redirect('/sign-out')
          } catch (redirectError) {
            console.error('Server-side redirect failed:', redirectError)
          }
        }
        return Promise.reject(new Error('Session expired - please login again'))
      }
    }

    let errorMessage = 'An error occurred'

    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 400:
          errorMessage = data?.message || 'Bad request'
          break
        case 401:
          errorMessage = 'Unauthorized - please login'
          break
        case 403:
          errorMessage = 'Access denied'
          break
        case 404:
          errorMessage = 'Resource not found'
          break
        case 422:
          errorMessage = data?.message || 'Validation error'
          break
        case 500:
          errorMessage = 'Internal server error'
          break
        default:
          errorMessage = data?.message || `HTTP error ${status}`
      }
    } else if (error.request) {
      errorMessage = 'Network error - please check your internet connection'
    } else {
      errorMessage = error.message || 'Unknown error'
    }

    return Promise.reject(new Error(errorMessage))
  },
)

localApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
    const originalRequest = error.config

    // For local API calls, handle 401/403 differently since these are internal Next.js routes
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url?.endsWith('/api/auth/refresh')
    ) {
      originalRequest._retry = true

      try {
        // Try to refresh tokens with refresh_token from cookies if server-side
        const refreshHeaders = await getRefreshHeaders()

        console.log('[AxiosServer] localApiClient -> refresh start', {
          url: '/api/auth/refresh',
          hasCookieHeader: Boolean((refreshHeaders as any)?.Cookie),
          hasAuthHeader: Boolean((refreshHeaders as any)?.Authorization),
          originalUrl: originalRequest?.url,
        })

        const refreshResult = await localApiClient.get('/api/auth/refresh', {
          headers: {
            ...refreshHeaders,
            ...(originalRequest.headers.Cookie ? { Cookie: originalRequest.headers.Cookie } : {}),
          },
        })

        console.log('[AxiosServer] localApiClient -> refresh success', {
          status: refreshResult?.status,
          originalUrl: originalRequest?.url,
        })
        // Retry the original request
        return localApiClient(originalRequest)
      } catch (refreshError) {
        console.error('Local API token refresh failed:', refreshError)
        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in'
        } else {
          // Server-side redirect
          try {
            const { cookies } = await import('next/headers')
            const { redirect } = await import('next/navigation')
            const cookieStore = await cookies()

            // Clear access_token and refresh_token cookies
            cookieStore.delete('access_token')
            cookieStore.delete('refresh_token')

            redirect('/sign-in')
          } catch (redirectError) {
            console.error('Server-side redirect failed:', redirectError)
          }
        }
        return Promise.reject(new Error('Session expired - please login again'))
      }
    }

    let errorMessage = 'An error occurred'
    if (error.response) {
      const status = error.response.status
      const data = error.response.data
      switch (status) {
        case 400:
          errorMessage = data?.message || 'Bad request'
          break
        case 401:
          errorMessage = 'Unauthorized - please login'
          break
        case 403:
          errorMessage = 'Access denied'
          break
        case 404:
          errorMessage = 'Resource not found'
          break
        case 422:
          errorMessage = data?.message || 'Validation error'
          break
        case 500:
          errorMessage = 'Internal server error'
          break
        default:
          errorMessage = data?.message || `HTTP error ${status}`
      }
    } else if (error.request) {
      errorMessage = 'Network error - please check your internet connection'
    } else {
      errorMessage = error.message || 'Unknown error'
    }
    return Promise.reject(new Error(errorMessage))
  },
)

export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<T>(url, config).then((response) => response.data),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post<T>(url, data, config).then((response) => response.data),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put<T>(url, data, config).then((response) => response.data),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch<T>(url, data, config).then((response) => response.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete<T>(url, config).then((response) => response.data),
}

export const localApi = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    localApiClient.get<T>(url, config).then((response) => response.data),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    localApiClient.post<T>(url, data, config).then((response) => response.data),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    localApiClient.put<T>(url, data, config).then((response) => response.data),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    localApiClient.patch<T>(url, data, config).then((response) => response.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    localApiClient.delete<T>(url, config).then((response) => response.data),
}

export default apiClient

export type { AxiosRequestConfig, AxiosResponse } from 'axios'
