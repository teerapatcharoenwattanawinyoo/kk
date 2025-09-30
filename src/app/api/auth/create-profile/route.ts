// src/app/api/auth/create-profile/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'

const API_BASE_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL

const CreateProfileSchema = z.object({
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  country_code: z.string().min(1),
  profilename: z.string().min(1),
  password: z.string().min(1),
  token: z.string().min(1),
})

export async function POST(req: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json({ message: 'Backend URL not configured' }, { status: 500 })
  }
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }
  const parsed = CreateProfileSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: 'Validation error' }, { status: 422 })
  const url = `${API_BASE_URL}/auth/create-profile`
  const be = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'lang-id': '1' },
    body: JSON.stringify(parsed.data),
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
