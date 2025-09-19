// src/app/api/auth/sign-out/route.ts
import { COOKIE_KEYS } from '@/lib/constants'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const API_BASE_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL

// Best practice: accept only POST for sign-out
export async function POST(_req: NextRequest) {
  console.log('[API] /api/auth/sign-out: incoming request')

  const secure = process.env.NODE_ENV === 'production'
  const res = NextResponse.json({ message: 'Signed out' }, { status: 200 })

  try {
    // Try to invalidate token on backend if possible
    if (API_BASE_URL) {
      const cookieStore = await cookies()
      const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value

      if (accessToken) {
        console.log('[API] /api/auth/sign-out: invalidating token on backend')
        try {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
              'lang-id': '1',
            },
            cache: 'no-store',
          })
          console.log('[API] /api/auth/sign-out: backend logout successful')
        } catch (backendError) {
          console.warn(
            '[API] /api/auth/sign-out: backend logout failed:',
            backendError,
          )
          // Continue with local logout even if backend fails
        }
      }
    }
  } catch (error) {
    console.warn(
      '[API] /api/auth/sign-out: error during backend logout:',
      error,
    )
    // Continue with local logout
  }

  // Clear auth cookies (httpOnly) with explicit deletion
  res.cookies.set(COOKIE_KEYS.ACCESS_TOKEN, '', {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  })
  res.cookies.set(COOKIE_KEYS.REFRESH_TOKEN, '', {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  })

  res.cookies.set(COOKIE_KEYS.CLIENT_ACCESS_TOKEN, '', {
    httpOnly: false,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  })
  res.cookies.set(COOKIE_KEYS.CLIENT_REFRESH_TOKEN, '', {
    httpOnly: false,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  })

  // Prevent caching of this response
  res.headers.set('Cache-Control', 'no-store')

  console.log('[API] /api/auth/sign-out: cookies cleared')
  return res
}

// Optional: allow preflight requests if ever called cross-origin
export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}
