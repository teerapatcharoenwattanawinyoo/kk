// src/lib/server/backend.ts
import { cookies } from 'next/headers'
import 'server-only'
import { getLanguageId } from '@/lib/utils/language'

const BE = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL

type BackendOptions = RequestInit & {
  revalidate?: number
  timeoutMs?: number
}

function isFormData(body: any): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData
}

async function doFetch(path: string, opts: BackendOptions = {}, attempt = 0) {
  if (!BE) throw new Error('Backend URL not configured')

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  // Derive language id (server default to 'th' -> 1)
  const langId = String(getLanguageId())

  const headers: Record<string, string> = {
    'lang-id': langId,
    ...((opts.headers as Record<string, string>) || {}),
  }

  // Only set Content-Type for JSON bodies
  if (!('Content-Type' in headers) && !isFormData(opts.body)) {
    headers['Content-Type'] = 'application/json'
  }

  if (accessToken && !('Authorization' in headers)) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const url = `${BE}${path}`
  const cache = opts.revalidate ? 'force-cache' : 'no-store'
  const next = opts.revalidate ? { revalidate: opts.revalidate } : undefined

  console.log('[backend] request', {
    url,
    method: opts.method || 'GET',
    attempt,
    cache,
  })

  const res = await fetch(url, {
    ...opts,
    headers,
    cache,
    next,
  })

  if (res.ok) return res

  // Handle 401/403 -> try refresh once
  if (
    attempt === 0 &&
    (res.status === 401 || res.status === 403) &&
    !path.endsWith('/auth/refresh-token')
  ) {
    console.warn('[backend] unauthorized, attempting refresh')
    const refreshCookie = cookieStore.get('refresh_token')?.value
    if (!refreshCookie) {
      console.warn('[backend] no refresh token cookie')
      return res
    }
    try {
      // Call backend refresh directly to ensure we can set cookies in this context
      const refreshRes = await fetch(`${BE}/auth/refresh-token`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${refreshCookie}`,
          'Content-Type': 'application/json',
          'lang-id': langId,
        },
        cache: 'no-store',
      })
      const text = await refreshRes.text()
      let json: any = {}
      try {
        json = text ? JSON.parse(text) : {}
      } catch (e) {
        console.error('[backend] refresh parse error', text)
      }

      if (!refreshRes.ok) {
        console.error('[backend] refresh failed', refreshRes.status, json)
        // Clear cookies on failure
        cookieStore.delete('access_token')
        cookieStore.delete('refresh_token')
        return res
      }

      const newAccess = json?.data?.access_token || json?.access_token
      const newRefresh =
        json?.data?.refresh_token || json?.refresh_token || refreshCookie
      if (newAccess) {
        cookieStore.set('access_token', newAccess, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24,
        })
      }
      if (newRefresh) {
        cookieStore.set('refresh_token', newRefresh, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
      }

      // Retry original request once with new access token
      return doFetch(path, opts, 1)
    } catch (e) {
      console.error('[backend] refresh exception', e)
      cookieStore.delete('access_token')
      cookieStore.delete('refresh_token')
      return res
    }
  }

  return res
}

export async function backend<T>(
  path: string,
  options: BackendOptions = {},
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? 60_000
  const controller = new AbortController()
  const timer = setTimeout(
    () => controller.abort('backend timed out'),
    timeoutMs,
  )
  const res = await doFetch(path, { ...options, signal: controller.signal })
  clearTimeout(timer)

  if (!res.ok) {
    let errorMessage = 'An error occurred'
    try {
      const data = await res.json()
      const status = res.status
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
      console.error('[backend] error', res.status, data)
    } catch {
      const text = await res.text().catch(() => '')
      console.error('[backend] error (non-JSON)', res.status, text)
      errorMessage = `Backend error ${res.status}: ${text}`
    }
    throw new Error(errorMessage)
  }

  // Try to parse JSON, allow empty body
  const text = await res.text()
  return (text ? JSON.parse(text) : {}) as T
}

// Convenience object similar to axios wrappers
export const serverApi = {
  get: <T = any>(url: string, config?: BackendOptions) =>
    backend<T>(url, { ...config, method: 'GET' }),
  post: <T = any>(url: string, data?: any, config?: BackendOptions) =>
    backend<T>(url, {
      ...config,
      method: 'POST',
      body: isFormData(data) ? (data as any) : JSON.stringify(data ?? {}),
    }),
  put: <T = any>(url: string, data?: any, config?: BackendOptions) =>
    backend<T>(url, {
      ...config,
      method: 'PUT',
      body: isFormData(data) ? (data as any) : JSON.stringify(data ?? {}),
    }),
  patch: <T = any>(url: string, data?: any, config?: BackendOptions) =>
    backend<T>(url, {
      ...config,
      method: 'PATCH',
      body: isFormData(data) ? (data as any) : JSON.stringify(data ?? {}),
    }),
  delete: <T = any>(url: string, config?: BackendOptions) =>
    backend<T>(url, { ...config, method: 'DELETE' }),
}
