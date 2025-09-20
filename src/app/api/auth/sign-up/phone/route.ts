// src/app/api/auth/sign-up/phone/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const API_BASE_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL

const RegisterByPhoneSchema = z.object({
  phone: z.string().min(1),
  country_code: z.string().min(1),
})

export async function POST(req: Request) {
  console.log('[API] /api/auth/sign-up/phone: incoming request')

  if (!API_BASE_URL) {
    console.error('[API] Backend URL not configured')
    return NextResponse.json(
      { message: 'Backend URL not configured' },
      { status: 500 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
    console.log('[API] Request body:', body)
  } catch {
    console.error('[API] Invalid JSON body')
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = RegisterByPhoneSchema.safeParse(body)
  if (!parsed.success) {
    console.error('[API] Validation error:', parsed.error)
    return NextResponse.json({ message: 'Validation error' }, { status: 422 })
  }

  const url = `${API_BASE_URL}/auth/register/phone`
  console.log('[API] Calling backend URL:', url)
  console.log('[API] Request data:', parsed.data)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'lang-id': '1' },
      body: JSON.stringify(parsed.data),
      cache: 'no-store',
    })

    console.log('[API] Backend response status:', res.status)

    const text = await res.text()
    console.log('[API] Backend response text:', text)

    let json: any = {}
    try {
      json = text ? JSON.parse(text) : {}
    } catch (parseError) {
      console.error('[API] Failed to parse backend response:', parseError)
    }

    if (!res.ok) {
      console.error('[API] Backend error:', res.status, json)
      return NextResponse.json(json, { status: res.status })
    }

    console.log('[API] Success response:', json)
    return NextResponse.json(json, { status: 200 })
  } catch (fetchError) {
    console.error('[API] Fetch error:', fetchError)
    return NextResponse.json(
      { message: 'Backend connection failed' },
      { status: 503 },
    )
  }
}
