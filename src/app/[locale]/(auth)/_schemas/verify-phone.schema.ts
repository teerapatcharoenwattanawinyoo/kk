// src/app/[locale]/(auth)/verify-phone/_schemas/verify-phone.schema.ts
import { z } from 'zod'

export const VerifyPhoneFormSchema = z.object({
  otp: z.string().min(4, 'OTP is too short'),
})

export type VerifyPhoneInput = z.infer<typeof VerifyPhoneFormSchema>

// API schemas
export const VerifyPhoneRequestSchema = z.object({
  phone: z.string().min(1),
  otp: z.string().min(1),
  token: z.string().min(1),
  otpRef: z.string().min(1),
})

export const VerifyPhoneResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
})

export type VerifyPhoneOtpRequest = z.infer<typeof VerifyPhoneRequestSchema>
export type VerifyPhoneOtpResponse = z.infer<typeof VerifyPhoneResponseSchema>
