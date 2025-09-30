// src/app/api/auth/refresh/route.ts
import { COOKIE_KEYS } from '@/lib/constants'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'

const API_BASE_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL

const RefreshResponseSchema = z.object({
  statusCode: z.number().optional(),
  message: z.string().optional(),
  data: z
    .object({
      access_token: z.string(),
      refresh_token: z.string().optional().nullable(),
      user: z.unknown().optional(),
    })
    .optional(),
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
})

export async function GET() {
  console.log('[API] /api/auth/refresh: incoming request')

  if (!API_BASE_URL) {
    console.error('[API] Backend URL not configured')
    return NextResponse.json({ message: 'Backend URL not configured' }, { status: 500 })
  }

  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get(COOKIE_KEYS.REFRESH_TOKEN)?.value

    if (!refreshToken) {
      console.warn('[API] /api/auth/refresh: missing refresh_token cookie')
      return NextResponse.json({ message: 'No refresh token' }, { status: 401 })
    }

    const url = `${API_BASE_URL}/auth/refresh-token`
    console.log('[API] /api/auth/refresh: forwarding to', url)
    const langId = '1'
    console.log('[API] /api/auth/refresh: lang-id', langId)

    const beRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
        'lang-id': langId,
      },
      cache: 'no-store',
    })

    const text = await beRes.text()
    let json: any
    try {
      json = text ? JSON.parse(text) : {}
    } catch (e) {
      console.error('[API] /api/auth/refresh: invalid JSON from backend:', text)
      return NextResponse.json({ message: 'Invalid response from backend' }, { status: 502 })
    }

    if (!beRes.ok) {
      console.error('[API] /api/auth/refresh: backend error', beRes.status, json)
      return NextResponse.json(json, { status: beRes.status })
    }

    const parsed = RefreshResponseSchema.safeParse(json)
    if (!parsed.success) {
      console.error('[API] /api/auth/refresh: response validation failed', parsed.error)
      return NextResponse.json({ message: 'Invalid response schema' }, { status: 502 })
    }

    const payload = parsed.data
    const accessToken = payload.data?.access_token || payload.access_token
    const nextRefreshToken = payload.data?.refresh_token || payload.refresh_token || refreshToken

    if (!accessToken) {
      console.error('[API] /api/auth/refresh: no access_token in response')
      return NextResponse.json({ message: 'No access token in response' }, { status: 502 })
    }

    // Update cookies (httpOnly)
    const response = NextResponse.json(
      {
        access_token: accessToken,
        refresh_token: nextRefreshToken,
        user: payload.data?.user,
      },
      { status: 200 },
    )

    // 1 day for access token, 7 days for refresh token
    const secure = process.env.NODE_ENV === 'production'
    response.cookies.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })
    if (nextRefreshToken) {
      response.cookies.set(COOKIE_KEYS.REFRESH_TOKEN, nextRefreshToken, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    response.cookies.set(COOKIE_KEYS.CLIENT_ACCESS_TOKEN, accessToken, {
      httpOnly: false,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })
    if (nextRefreshToken) {
      response.cookies.set(COOKIE_KEYS.CLIENT_REFRESH_TOKEN, nextRefreshToken, {
        httpOnly: false,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    console.log('[API] /api/auth/refresh: success')
    return response
  } catch (err) {
    console.error('[API] /api/auth/refresh: unexpected error', err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
