// src/app/[locale]/(auth)/sign-in/_server/actions.ts
'use server'

import { COOKIE_KEYS } from '@/lib/constants'
import { serverApi } from '@/lib/server/backend'
import { formatPhoneForAPI } from '@/lib/utils/phone'
import type { LoginResponse } from '@/modules/auth/api/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { BackendLoginSchema, SignInSchema } from '../models/sign-in.schema'

type ActionState = {
  ok?: boolean
  error?: string
}

function maskEmail(email?: string | null) {
  if (!email) return email
  const [name, domain] = email.split('@')
  if (!domain) return email
  if (name.length <= 2) return '*'.repeat(name.length) + '@' + domain
  return name[0] + '*'.repeat(Math.max(1, name.length - 2)) + name.slice(-1) + '@' + domain
}

function maskPhone(phone?: string | null) {
  if (!phone) return phone
  const digits = phone.replace(/\D/g, '')
  if (digits.length <= 4) return '*'.repeat(digits.length)
  return digits.slice(0, 2) + '*'.repeat(digits.length - 4) + digits.slice(-2)
}

export async function signInAction(
  _prevState: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  try {
    const raw = {
      method: (formData.get('method') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      phone: (formData.get('phone') as string) || undefined,
      password: (formData.get('password') as string) || undefined,
    }

    console.log('[Action] signInAction: received form data', {
      method: raw.method,
      email: maskEmail(raw.email),
      phone: maskPhone(raw.phone),
      password_present: !!raw.password,
    })

    const parsed = SignInSchema.safeParse(raw)
    if (!parsed.success) {
      return { ok: false, error: 'Validation error' }
    }

    // Route through Next.js internal API
    console.log('[Action] signInAction: calling /api/auth/sign-in')
    const payload = {
      email: parsed.data.email,
      phone: parsed.data.phone ? formatPhoneForAPI(parsed.data.phone) : undefined,
      password: parsed.data.password,
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'lang-id': '1' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    if (!res.ok) {
      const msg = await res.text()
      console.error('[Action] signInAction: failed', res.status, msg)
      return { ok: false, error: 'Sign in failed' }
    }

    // Cookies are set by the route handler with httpOnly
    console.log('[Action] signInAction: success, redirecting to dashboard')
    redirect('/dashboard')
  } catch (e) {
    console.error('[Action] signInAction: unexpected error', e)
    return { ok: false, error: 'Unexpected error' }
  }
}

// Server Action for hooks: accept object input, do server-side fetch, set cookies via route, and return data
export async function signInWithCredentials(input: {
  email?: string
  phone?: string
  password: string
}): Promise<LoginResponse> {
  console.log('[Action] signInWithCredentials: incoming input', {
    email: maskEmail(input.email),
    phone: maskPhone(input.phone),
    password_present: !!input.password,
  })
  const parsed = SignInSchema.safeParse({
    email: input.email,
    phone: input.phone,
    password: input.password,
  })
  if (!parsed.success) {
    console.warn('[Action] signInWithCredentials: validation failed', parsed.error.flatten())
    throw new Error('Validation error')
  }

  const payload = {
    email: parsed.data.email,
    phone: parsed.data.phone ? formatPhoneForAPI(parsed.data.phone) : undefined,
    password: parsed.data.password,
  }

  console.log('[Action] signInWithCredentials: calling BE via serverApi', {
    method: payload.email ? 'email' : 'phone',
    identifier: maskEmail(payload.email) || maskPhone(payload.phone),
  })
  const raw = await serverApi.post<any>('/auth/login', payload, {
    headers: { 'lang-id': '1' },
  })

  const parsedRes = BackendLoginSchema.safeParse(raw)
  if (!parsedRes.success) {
    console.error('[Action] signInWithCredentials: invalid response schema', parsedRes.error)
    throw new Error('Invalid response schema')
  }

  const { access_token, refresh_token, user } = parsedRes.data.data
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
  console.log('[Action] signInWithCredentials: BE responded', {
    has_access_token: !!access_token,
    has_refresh_token: !!refresh_token,
    has_user: !!user,
  })

  // Set httpOnly cookies on server (respect env for secure)
  const cookieStore = await cookies()
  const secure = false
  const oneDay = 60 * 60 * 24
  const sevenDays = oneDay * 7

  cookieStore.set(COOKIE_KEYS.ACCESS_TOKEN, access_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: oneDay,
    expires: new Date(Date.now() + oneDay * 1000),
  })
  cookieStore.set(COOKIE_KEYS.REFRESH_TOKEN, refresh_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: sevenDays,
    expires: new Date(Date.now() + sevenDays * 1000),
  })

  cookieStore.set(COOKIE_KEYS.CLIENT_ACCESS_TOKEN, access_token, {
    httpOnly: false,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: oneDay,
    expires: new Date(Date.now() + oneDay * 1000),
  })
  cookieStore.set(COOKIE_KEYS.CLIENT_REFRESH_TOKEN, refresh_token, {
    httpOnly: false,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: sevenDays,
    expires: new Date(Date.now() + sevenDays * 1000),
  })

  console.log('[Action] signInWithCredentials: success (cookies set). user_data', {
    has_customer_id: !!user_data.customer_id,
    has_email: !!user_data.email,
    has_phone: !!user_data.phone,
  })
  return {
    access_token,
    refresh_token,
    user: user as any,
    json: user_data,
  } as any
}
