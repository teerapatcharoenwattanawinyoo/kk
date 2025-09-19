'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { VerifyEmailFormSchema } from '../models/verify-email.schema'

type ActionState = { ok?: boolean; error?: string }

export async function verifyEmailAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const raw = { otp: (formData.get('otp') as string) || '' }
  const parsed = VerifyEmailFormSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'Validation error' }

  const cookieStore = await cookies()
  const email = cookieStore.get('register_email')?.value
  const token = cookieStore.get('register_token')?.value
  const otpRef = cookieStore.get('register_otp_ref')?.value || token // Use token as fallback if otpRef is missing

  console.log('[Debug] verifyEmailAction cookies:', {
    hasEmail: !!email,
    hasToken: !!token,
    hasOtpRef: !!otpRef,
    email: email ? 'present' : 'missing',
    token: token ? 'present' : 'missing',
    otpRef: otpRef ? otpRef : 'missing',
  })

  if (!email || !token) return { ok: false, error: 'Missing email or token' }

  const h = await headers()
  const proto = h.get('x-forwarded-proto') || 'http'
  const host = h.get('host') || 'localhost:3000'
  const base = host.startsWith('http') ? host : `${proto}://${host}`
  const res = await fetch(`${base}/api/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp: parsed.data.otp, token, otpRef }),
    cache: 'no-store',
  })
  if (!res.ok) {
    const msg = await res.text()
    console.error('[Action] verifyEmailAction failed', res.status, msg)
    return { ok: false, error: 'Verify email failed' }
  }
  redirect('/create-profile')
}

export async function verifyEmailWithOtp(input: { otp: string }) {
  const parsed = VerifyEmailFormSchema.safeParse(input)
  if (!parsed.success) throw new Error('Validation error')
  const cookieStore = await cookies()
  const email = cookieStore.get('register_email')?.value
  const token = cookieStore.get('register_token')?.value
  const otpRef = cookieStore.get('register_otp_ref')?.value || token // Use token as fallback if otpRef is missing
  if (!email || !token) throw new Error('Missing email or token')

  const h2 = await headers()
  const proto2 = h2.get('x-forwarded-proto') || 'http'
  const host2 = h2.get('host') || 'localhost:3000'
  const base2 = host2.startsWith('http') ? host2 : `${proto2}://${host2}`
  const res = await fetch(`${base2}/api/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp: parsed.data.otp, token, otpRef }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Verify email failed')
  return await res.json()
}
