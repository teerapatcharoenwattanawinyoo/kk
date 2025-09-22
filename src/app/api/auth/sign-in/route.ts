// src/app/api/auth/sign-in/route.ts
import { COOKIE_KEYS } from '@/lib/constants'
import { BackendLoginSchema, SignInSchema } from '@/modules/auth/models/sign-in.schema'
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL

// FE input validation and BE response schema are imported from shared schemas

export async function POST(req: NextRequest) {
  console.log('[API] /api/auth/sign-in: incoming request')

  if (!API_BASE_URL) {
    console.error('[API] Backend URL not configured')
    return NextResponse.json({ message: 'Backend URL not configured' }, { status: 500 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = SignInSchema.safeParse(body)
  if (!parsed.success) {
    console.warn('[API] /api/auth/sign-in: validation failed', parsed.error.flatten())
    return NextResponse.json({ message: 'Validation error' }, { status: 422 })
  }

  const { email, phone, password } = parsed.data
  // Be careful not to log password
  console.log('[API] /api/auth/sign-in: forwarding login', {
    method: email ? 'email' : 'phone',
    identifier: email || phone,
  })

  try {
    const url = `${API_BASE_URL}/auth/login`
    const langId = '1'
    console.log('[API] /api/auth/sign-in: lang-id', langId)
    const beRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'lang-id': langId,
      },
      body: JSON.stringify({ email, phone, password }),
      cache: 'no-store',
    })

    const text = await beRes.text()
    let json: any
    try {
      json = text ? JSON.parse(text) : {}
    } catch (e) {
      console.error('[API] /api/auth/sign-in: invalid JSON from backend:', text)
      return NextResponse.json({ message: 'Invalid response from backend' }, { status: 502 })
    }

    if (!beRes.ok) {
      console.error('[API] /api/auth/sign-in: backend error', beRes.status, json)
      return NextResponse.json(json, { status: beRes.status })
    }

    const result = BackendLoginSchema.safeParse(json)
    if (!result.success) {
      console.error('[API] /api/auth/sign-in: response validation failed', result.error)
      return NextResponse.json({ message: 'Invalid response schema' }, { status: 502 })
    }

    const { access_token, refresh_token, user } = result.data.data

    // Build user_data payload example for client visibility (non-sensitive)
    const user_data = {
      customer_id: String((user as any)?.customer_id ?? ''),
      profilename: (user as any)?.profilename ?? null,
      email: (user as any)?.email ?? null,
      phone: (user as any)?.phone ?? null,
      avatar: (user as any)?.avatar ?? null,
      platform_type: (user as any)?.platform_type ?? null,
      company_id: (user as any)?.company_id ?? null,
      team_id: (user as any)?.team_id ?? null,
      device: (user as any)?.device ?? 'node',
      team_host_id: String((user as any)?.team_host_id ?? ''),
    }

    console.log('[API] /api/auth/sign-in: user_data prepared', {
      has_customer_id: !!user_data.customer_id,
      has_email: !!user_data.email,
      has_phone: !!user_data.phone,
    })

    const response = NextResponse.json(
      {
        access_token,
        refresh_token,
        user,
        json: user_data,
      },
      { status: 200 },
    )

    // Set httpOnly cookies
    const secure = process.env.NODE_ENV === 'production'
    response.cookies.set(COOKIE_KEYS.ACCESS_TOKEN, access_token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    })
    response.cookies.set(COOKIE_KEYS.REFRESH_TOKEN, refresh_token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Set client-readable cookies for frontend usage
    response.cookies.set(COOKIE_KEYS.CLIENT_ACCESS_TOKEN, access_token, {
      httpOnly: false,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })
    response.cookies.set(COOKIE_KEYS.CLIENT_REFRESH_TOKEN, refresh_token, {
      httpOnly: false,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    console.log('[API] /api/auth/sign-in: success')
    return response
  } catch (err) {
    console.error('[API] /api/auth/sign-in: unexpected error', err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
