import { formatPhoneForAPI } from '@/lib/utils'

import {
  forgotPasswordRequestSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  type VerifyOtpInput,
} from '../schemas'

export interface ForgotPasswordState {
  method: 'phone' | 'email'
  email: string
  phone: string
  otp: string[]
  password: string
  confirmPassword: string
  token: string
}

export const createInitialForgotPasswordState = (): ForgotPasswordState => ({
  method: 'phone',
  email: '',
  phone: '',
  otp: Array(6).fill(''),
  password: '',
  confirmPassword: '',
  token: '',
})

export type ForgotPasswordPayload =
  | { method: 'phone'; payload: { phone: string } }
  | { method: 'email'; payload: { email: string } }

export type ForgotPasswordPayloadResult =
  | { success: true; data: ForgotPasswordPayload }
  | { success: false; error: string }

export const buildForgotPasswordRequest = (
  state: Pick<ForgotPasswordState, 'method' | 'phone' | 'email'>,
): ForgotPasswordPayloadResult => {
  const parsed = forgotPasswordRequestSchema.safeParse({
    method: state.method,
    ...(state.method === 'phone'
      ? { phone: formatPhoneForAPI(state.phone) }
      : { email: state.email }),
  })

  if (!parsed.success) {
    const error = parsed.error.errors.at(0)
    return { success: false, error: error?.message ?? 'Invalid contact details' }
  }

  return {
    success: true,
    data:
      parsed.data.method === 'phone'
        ? { method: 'phone', payload: { phone: parsed.data.phone } }
        : { method: 'email', payload: { email: parsed.data.email } },
  }
}

export type VerifyOtpPayload =
  | { method: 'phone'; payload: VerifyOtpInput & { phone: string } }
  | { method: 'email'; payload: VerifyOtpInput & { email: string } }

export type VerifyOtpPayloadResult =
  | { success: true; data: VerifyOtpPayload }
  | { success: false; error: string }

export const buildVerifyOtpRequest = (
  state: Pick<ForgotPasswordState, 'method' | 'phone' | 'email' | 'otp' | 'token'>,
): VerifyOtpPayloadResult => {
  const otpValue = state.otp.join('')

  const parsed = verifyOtpSchema.safeParse({
    method: state.method,
    otp: otpValue,
    token: state.token,
    ...(state.method === 'phone'
      ? { phone: formatPhoneForAPI(state.phone) }
      : { email: state.email }),
  })

  if (!parsed.success) {
    const error = parsed.error.errors.at(0)
    return { success: false, error: error?.message ?? 'Invalid OTP' }
  }

  return {
    success: true,
    data:
      parsed.data.method === 'phone'
        ? {
            method: 'phone',
            payload: {
              ...parsed.data,
              phone: formatPhoneForAPI(state.phone),
            },
          }
        : {
            method: 'email',
            payload: {
              ...parsed.data,
              email: state.email,
            },
          },
  }
}

export type ResetPasswordPayload = { token: string; newPassword: string }

export type ResetPasswordPayloadResult =
  | { success: true; data: ResetPasswordPayload }
  | { success: false; error: string }

export const buildResetPasswordRequest = (
  state: Pick<ForgotPasswordState, 'password' | 'confirmPassword' | 'token'>,
): ResetPasswordPayloadResult => {
  const parsed = resetPasswordSchema.safeParse({
    password: state.password,
    confirmPassword: state.confirmPassword,
  })

  if (!parsed.success) {
    const error = parsed.error.errors.at(0)
    return { success: false, error: error?.message ?? 'Invalid password' }
  }

  return {
    success: true,
    data: { token: state.token, newPassword: parsed.data.password },
  }
}
