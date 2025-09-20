// src/lib/server/auth.ts
import type { User } from '@/modules/auth/api/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import 'server-only'

// Get access token from httpOnly cookie
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value ?? null
}

function base64UrlDecode(input: string): string {
  const pad = 4 - (input.length % 4 || 4)
  const normalized = (input + '='.repeat(pad))
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  return Buffer.from(normalized, 'base64').toString('utf8')
}

function decodeJwt<T = any>(token: string): T | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = JSON.parse(base64UrlDecode(parts[1]))
    return payload as T
  } catch {
    return null
  }
}

// Derive current user from access_token claims
export async function getUser(): Promise<User | null> {
  const access = await getAccessToken()
  if (!access) return null

  const claims = decodeJwt<Record<string, any>>(access)
  if (!claims) return null

  // Map common claims to our User shape; cast for compatibility
  const user = {
    customer_id: (claims.customer_id ?? claims.sub) as any,
    email: (claims.email ?? null) as any,
    phone: (claims.phone ?? null) as any,
    profilename: (claims.profilename ?? claims.name ?? null) as any,
    avatar: (claims.avatar ?? null) as any,
    platform_type: (claims.platform_type ?? 'onecharge') as any,
    company_id: (claims.company_id ?? null) as any,
    team_id: (claims.team_id ?? null) as any,
    device: (claims.device ?? 'node') as any,
    team_host_id: (claims.team_host_id ?? null) as any,
  } as any as User

  return user
}

// Ensure user is authenticated; otherwise redirect to sign-in
export async function requireAuth(redirectTo = '/sign-in'): Promise<User> {
  const user = await getUser()
  if (!user) redirect(redirectTo)
  return user
}

// Convenience: get team_host_id from JWT claims (server-only)
export async function getTeamHostId(): Promise<string | number | null> {
  const user = await getUser()
  const val = user?.team_host_id as unknown
  if (val === undefined || val === null) return null
  // Keep original type if number; otherwise coerce to string
  return typeof val === 'number' ? val : String(val)
}
