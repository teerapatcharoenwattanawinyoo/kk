// src/app/[locale]/(auth)/sign-in/_schemas/forgot-password.schema.ts
import { z } from 'zod'

export const ForgotPasswordEmailRequestSchema = z.object({
  email: z.string().email(),
})

export const ForgotPasswordPhoneRequestSchema = z.object({
  phone: z.string().min(1),
})

export const VerifyEmailOTPRequestSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(1),
  token: z.string().min(1),
})

export const VerifyPhoneOTPRequestSchema = z.object({
  phone: z.string().min(1),
  otp: z.string().min(1),
  token: z.string().min(1),
})

export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6),
})

export const ForgotPasswordResponseSchema = z.object({
  token: z.string(),
  message: z.string(),
})

export const VerifyOTPResponseSchema = z.object({
  token: z.string(),
  message: z.string(),
})

export type ForgotPasswordEmailRequest = z.infer<
  typeof ForgotPasswordEmailRequestSchema
>
export type ForgotPasswordPhoneRequest = z.infer<
  typeof ForgotPasswordPhoneRequestSchema
>
export type VerifyEmailOTPRequest = z.infer<typeof VerifyEmailOTPRequestSchema>
export type VerifyPhoneOTPRequest = z.infer<typeof VerifyPhoneOTPRequestSchema>
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>
export type ForgotPasswordResponse = z.infer<
  typeof ForgotPasswordResponseSchema
>
export type VerifyOTPResponse = z.infer<typeof VerifyOTPResponseSchema>
