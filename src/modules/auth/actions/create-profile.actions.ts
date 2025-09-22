'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createProfile } from '../api/auth'

export async function createProfileAction(data: { profilename: string; password: string }) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('register_token')?.value
    const email = cookieStore.get('register_email')?.value
    const phone = cookieStore.get('phone')?.value
    const countryCode = cookieStore.get('country_code')?.value

    if (!token || !countryCode) {
      return { success: false, message: 'Registration session expired' }
    }

    if (!email && !phone) {
      return { success: false, message: 'Missing email or phone information' }
    }

    const result = await createProfile({
      email: email || '',
      phone: phone || '',
      country_code: countryCode,
      profilename: data.profilename,
      password: data.password,
      token,
    })

    if (result.statusCode === 200 || result.statusCode === 201) {
      // Clear all registration cookies
      cookieStore.delete('register_token')
      cookieStore.delete('register_email')
      cookieStore.delete('phone')
      cookieStore.delete('country_code')
      cookieStore.delete('register_otp_ref')

      // Redirect to sign in
      redirect('/sign-in')
    }

    return {
      success: false,
      message: result.message || 'Profile creation failed',
    }
  } catch (error) {
    console.error('Create profile error:', error)
    return { success: false, message: 'Profile creation failed' }
  }
}
