'use server'

import { cookies } from 'next/headers'
import {
  forgotPasswordApi,
  resetPasswordApi,
  verifyEmailOTPApi,
  verifyPhoneOTPApi,
} from '../_api/forgot-password'

export async function forgotPasswordAction(data: { email?: string; phone?: string }) {
  try {
    const result = await forgotPasswordApi(data)

    if (result.data?.token) {
      const cookieStore = await cookies()
      cookieStore.set('forgot_password_token', result.data.token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 15, // 15 minutes
      })

      if (data.email) {
        cookieStore.set('forgot_password_email', data.email, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 15,
        })
      }

      if (data.phone) {
        cookieStore.set('forgot_password_phone', data.phone, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 15,
        })
      }
    }

    return {
      success: !!result.data?.token,
      message: result.message,
      token: result.data?.token,
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    return { success: false, message: 'Failed to send reset code' }
  }
}

export async function verifyForgotPasswordOTPAction(data: {
  otp: string
  method: 'email' | 'phone'
}) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('forgot_password_token')?.value
    const email = cookieStore.get('forgot_password_email')?.value
    const phone = cookieStore.get('forgot_password_phone')?.value

    if (!token) {
      return { success: false, message: 'Token not found' }
    }

    let result
    if (data.method === 'email' && email) {
      result = await verifyEmailOTPApi({
        email,
        otp: data.otp,
        token,
      })
    } else if (data.method === 'phone' && phone) {
      result = await verifyPhoneOTPApi({
        phone,
        otp: data.otp,
        token,
      })
    } else {
      return { success: false, message: 'Invalid verification method' }
    }

    if (result.statusCode === 200 && result.data?.token) {
      // For forgot password verification, we might need to set a new token
      // This depends on your API design - you may need to adjust this
      cookieStore.set('reset_password_token', result.data.token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 15,
      })
    }

    return {
      success: result.statusCode === 200 && !!result.data?.token,
      message: result.message,
      token: result.data?.token,
    }
  } catch (error) {
    console.error('Verify OTP error:', error)
    return { success: false, message: 'OTP verification failed' }
  }
}

export async function resetPasswordAction(data: { newPassword: string }) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('reset_password_token')?.value

    if (!token) {
      return { success: false, message: 'Reset token not found' }
    }

    const result = await resetPasswordApi({
      token,
      newPassword: data.newPassword,
    })

    if (result.statusCode === 200) {
      // Clear all forgot password related cookies
      cookieStore.delete('forgot_password_token')
      cookieStore.delete('forgot_password_email')
      cookieStore.delete('forgot_password_phone')
      cookieStore.delete('reset_password_token')
    }

    return {
      success: result.statusCode === 200,
      message: result.data?.message || result.message || 'Password reset completed',
    }
  } catch (error) {
    console.error('Reset password error:', error)
    return { success: false, message: 'Password reset failed' }
  }
}
