'use server'

import { COOKIE_KEYS } from '@/lib/constants'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signOutAction() {
  try {
    console.log('Starting sign out process...')

    // Clear cookies server-side
    const cookieStore = await cookies()

    // Clear all auth-related cookies
    cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN)
    cookieStore.delete(COOKIE_KEYS.REFRESH_TOKEN)

    // Also clear any registration cookies
    cookieStore.delete('register_token')
    cookieStore.delete('register_email')
    cookieStore.delete('phone')
    cookieStore.delete('country_code')
    cookieStore.delete('register_otp_ref')
    cookieStore.delete('forgot_password_token')
    cookieStore.delete('forgot_password_email')
    cookieStore.delete('forgot_password_phone')
    cookieStore.delete('reset_password_token')

    console.log('Cookies cleared, redirecting to sign-in...')
  } catch (error) {
    // Don't log NEXT_REDIRECT as error - it's normal behavior
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is expected behavior for redirect() - don't log as error
      return
    }
    console.error('Sign out error:', error)
  }

  // Redirect to sign-in page (this will always throw NEXT_REDIRECT)
  redirect('/sign-in')
}
