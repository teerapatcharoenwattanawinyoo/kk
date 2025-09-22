import type { LoginResponse } from '@modules/auth'
import { localApi } from './config/axios-server'

// Use direct axios instance to avoid interceptor conflicts
export async function refreshAccessToken(_refreshToken?: string): Promise<LoginResponse> {
  // Step 7: Refresh token request to authorization server
  // Call internal API which reads httpOnly refresh token cookie and makes request to auth server
  console.log('[refreshAccessToken] Attempting token refresh')

  try {
    const data = await localApi.get<LoginResponse>('/api/auth/refresh')

    // Step 8: Access token and Refresh token received
    console.log('[refreshAccessToken] Token refresh successful')

    if (typeof window !== 'undefined') {
      try {
        // Dispatch event to notify other parts of the app that tokens were refreshed
        window.dispatchEvent(new CustomEvent('auth:refreshed'))
        // Optional: multi-tab sync marker
        localStorage.setItem('auth_last_refreshed', String(Date.now()))
      } catch (e) {
        console.warn('[refreshAccessToken] Failed to dispatch refresh event:', e)
      }
    }

    return data
  } catch (error) {
    console.error('[refreshAccessToken] Token refresh failed:', error)
    throw error
  }
}
