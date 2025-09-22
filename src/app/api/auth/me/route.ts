// src/app/api/auth/me/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET() {
  console.log('[API] /api/auth/me: incoming request')

  if (!API_BASE_URL) {
    console.error('[API] Backend URL not configured')
    return NextResponse.json({ message: 'Backend URL not configured' }, { status: 500 })
  }

  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      console.warn('[API] /api/auth/me: missing access_token cookie')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Step 3 & 5: Access token usage - forward request to resource server with token
    const url = `${API_BASE_URL}/auth/me`
    const langId = '1'
    console.log('[API] /api/auth/me: forwarding to resource server', url)

    const beRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'lang-id': langId,
      },
      cache: 'no-store',
    })

    const text = await beRes.text()
    let json: any
    try {
      json = text ? JSON.parse(text) : {}
    } catch (e) {
      console.error('[API] /api/auth/me: invalid JSON from backend:', text)
      return NextResponse.json({ message: 'Invalid response from backend' }, { status: 502 })
    }

    if (!beRes.ok) {
      console.error('[API] /api/auth/me: backend error', beRes.status, json)
      // Step 6: Invalid token error - pass through the error
      return NextResponse.json(json, { status: beRes.status })
    }

    // Step 4: Protected resource response
    console.log('[API] /api/auth/me: success from resource server')
    return NextResponse.json(json, { status: 200 })
  } catch (err) {
    console.error('[API] /api/auth/me: unexpected error', err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
