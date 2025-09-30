// src/lib/server/cookies.ts
import { cookies } from 'next/headers'
import 'server-only'

export async function getCookie(name: string) {
  const cookieStore = await cookies()
  return cookieStore.get(name)?.value ?? null
}

export async function setCookie(
  name: string,
  value: string,
  options?: {
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
    path?: string
    maxAge?: number
    expires?: Date
  },
) {
  const cookieStore = await cookies()
  cookieStore.set(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    ...options,
  })
}

export async function clearCookie(name: string) {
  const cookieStore = await cookies()
  cookieStore.delete(name)
}
