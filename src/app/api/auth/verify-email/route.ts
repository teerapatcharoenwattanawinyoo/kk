// src/app/api/auth/verify-email/route.ts
import { API_ENDPOINTS } from '@/lib/constants'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const API_BASE_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL

const VerifyEmailSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(1),
  token: z.string().min(1),
  otpRef: z.string().optional(), // Make otpRef optional as fallback
})

export async function POST(req: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: 'Backend URL not configured' },
      { status: 500 },
    )
  }
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }
  const parsed = VerifyEmailSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ message: 'Validation error' }, { status: 422 })
  const { otpRef, ...rest } = parsed.data
  const payload = otpRef ? { ...rest, refCode: otpRef } : rest

  const url = `${API_BASE_URL}${API_ENDPOINTS.AUTH.VERIFY_EMAIL}`
  const be = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'lang-id': '1' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })
  const text = await be.text()
  let json: any = {}
  try {
    json = text ? JSON.parse(text) : {}
  } catch {}
  if (!be.ok) return NextResponse.json(json, { status: be.status })
  return NextResponse.json(json, { status: 200 })
}
