'use server'
import { VerifyPhoneFormSchema } from '@modules/auth'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

type ActionState = { ok?: boolean; error?: string }

export async function verifyPhoneAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const raw = { otp: (formData.get('otp') as string) || '' }
  const parsed = VerifyPhoneFormSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'Validation error' }

  const cookieStore = await cookies()
  const phone = cookieStore.get('phone')?.value
  const token = cookieStore.get('register_token')?.value
  const otpRef = cookieStore.get('register_otp_ref')?.value || token // Use token as fallback if otpRef is missing

  console.log('[Debug] verifyPhoneAction cookies:', {
    hasPhone: !!phone,
    hasToken: !!token,
    hasOtpRef: !!otpRef,
    phone: phone ? 'present' : 'missing',
    token: token ? 'present' : 'missing',
    otpRef: otpRef ? otpRef : 'missing',
  })

  if (!phone || !token) return { ok: false, error: 'Missing phone or token' }

  const h = await headers()
  const proto = h.get('x-forwarded-proto') || 'http'
  const host = h.get('host') || 'localhost:3000'
  const base = host.startsWith('http') ? host : `${proto}://${host}`
  const res = await fetch(`${base}/api/auth/verify-phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp: parsed.data.otp, token, otpRef }),
    cache: 'no-store',
  })
  if (!res.ok) {
    const msg = await res.text()
    console.error('[Action] verifyPhoneAction failed', res.status, msg)
    return { ok: false, error: 'Verify phone failed' }
  }
  redirect('/create-profile')
}

export async function verifyPhoneWithOtp(input: { otp: string }) {
  const parsed = VerifyPhoneFormSchema.safeParse(input)
  if (!parsed.success) throw new Error('Validation error')
  const cookieStore = await cookies()
  const phone = cookieStore.get('phone')?.value
  const token = cookieStore.get('register_token')?.value
  const otpRef = cookieStore.get('register_otp_ref')?.value || token // Use token as fallback if otpRef is missing
  if (!phone || !token) throw new Error('Missing phone or token')

  const h2 = await headers()
  const proto2 = h2.get('x-forwarded-proto') || 'http'
  const host2 = h2.get('host') || 'localhost:3000'
  const base2 = host2.startsWith('http') ? host2 : `${proto2}://${host2}`
  const res = await fetch(`${base2}/api/auth/verify-phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp: parsed.data.otp, token, otpRef }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Verify phone failed')
  return await res.json()
}
