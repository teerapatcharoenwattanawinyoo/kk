'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { CreateProfileRequestSchema } from '../_schemas/create-profile.schema'
type ActionState = { ok?: boolean; error?: string }

export async function createProfileAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  console.log('[Debug] createProfileAction called')

  const profilename = (formData.get('profilename') as string) || ''
  const password = (formData.get('password') as string) || ''

  console.log('[Debug] Form data:', {
    hasProfilename: !!profilename,
    hasPassword: !!password,
    passwordLength: password.length,
  })

  if (!profilename || !password || password.length < 6) {
    return { ok: false, error: 'Invalid profile or password' }
  }

  const cookieStore = await cookies()
  const email = cookieStore.get('register_email')?.value || null
  const phone = cookieStore.get('phone')?.value || null
  const token = cookieStore.get('register_token')?.value || ''
  const country_code = cookieStore.get('country_code')?.value || ''

  console.log('[Debug] Cookies:', {
    hasEmail: !!email,
    hasPhone: !!phone,
    hasToken: !!token,
    hasCountryCode: !!country_code,
  })

  if (!token || !country_code)
    return { ok: false, error: 'Missing register info' }
  if (!email && !phone)
    return { ok: false, error: 'Missing email or phone in cookies' }

  const payload = { email, phone, country_code, profilename, password, token }

  const parsed = CreateProfileRequestSchema.safeParse(payload)
  if (!parsed.success) return { ok: false, error: 'Validation error' }

  const h = await headers()
  const proto = h.get('x-forwarded-proto') || 'http'
  const host = h.get('host') || 'localhost:3000'
  const base = host.startsWith('http') ? host : `${proto}://${host}`

  const res = await fetch(`${base}/api/auth/create-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
    cache: 'no-store',
  })
  if (!res.ok) {
    const msg = await res.text()
    console.error('[Action] createProfileAction failed', res.status, msg)
    return { ok: false, error: 'Create profile failed' }
  }

  const cookieStore2 = await cookies()
  cookieStore2.delete('register_email')
  cookieStore2.delete('register_token')
  cookieStore2.delete('register_otp_ref')
  cookieStore2.delete('country_code')
  cookieStore2.delete('phone')

  redirect('/sign-in')
}
