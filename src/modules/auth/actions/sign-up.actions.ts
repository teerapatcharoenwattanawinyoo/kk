'use server'

import { cookies } from 'next/headers'
import { registerByEmail, registerByPhone } from '../api/auth'

export async function registerByEmailAction(data: {
  email: string
  country_code: string
}) {
  try {
    console.log('Starting registerByEmailAction with data:', data)
    const result = await registerByEmail(data)
    console.log('Register by email result:', result)

    if (result.statusCode === 201 && result.data) {
      console.log('Registration successful, setting cookies...')
      // Set cookies server-side
      const cookieStore = await cookies()

      if (result.data.token) {
        cookieStore.set('register_token', result.data.token, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 15, // 15 minutes
        })
      }

      const otpRef = result.data.otpRef ?? (result.data as { refCode?: string }).refCode
      if (otpRef) {
        cookieStore.set('register_otp_ref', otpRef, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 15,
        })
      }

      cookieStore.set('register_email', data.email, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 15,
      })

      cookieStore.set('country_code', data.country_code, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 15,
      })

      console.log('Redirecting to /verify-email...')
      // Return success for client-side redirect instead of server redirect
      return {
        success: true,
        redirectTo: '/verify-email',
        message: 'Registration successful',
      }
    }

    console.log('Registration failed, returning error response')
    return { success: false, message: result.message || 'Registration failed' }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, message: 'Registration failed' }
  }
}

export async function registerByPhoneAction(data: {
  phone: string
  country_code: string
}) {
  try {
    console.log('Starting registerByPhoneAction with data:', data)
    const result = await registerByPhone(data)
    console.log('Register by phone result:', result)

    if (result.statusCode === 201 && result.data) {
      console.log('Registration successful, setting cookies...')
      const cookieStore = await cookies()

      if (result.data.token) {
        cookieStore.set('register_token', result.data.token, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 15,
        })
      }

      const otpRef = result.data.otpRef ?? (result.data as { refCode?: string }).refCode
      if (otpRef) {
        cookieStore.set('register_otp_ref', otpRef, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 15,
        })
      }

      cookieStore.set('phone', data.phone, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 15,
      })

      cookieStore.set('country_code', data.country_code, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 15,
      })

      console.log('Redirecting to /verify-phone...')
      // Return success for client-side redirect instead of server redirect
      return {
        success: true,
        redirectTo: '/verify-phone',
        message: 'Registration successful',
      }
    }

    console.log('Registration failed, returning error response')
    return { success: false, message: result.message || 'Registration failed' }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, message: 'Registration failed' }
  }
}
