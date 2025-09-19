// src/app/[locale]/(auth)/verify-email/_schemas/verify-email.schema.ts
import { z } from 'zod'

export const VerifyEmailFormSchema = z.object({
  otp: z.string().min(4, 'OTP is too short'),
})

export type VerifyEmailInput = z.infer<typeof VerifyEmailFormSchema>

// API schemas
export const VerifyEmailRequestSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(1),
  token: z.string().min(1),
  otpRef: z.string().optional(), // Make otpRef optional as fallback
})

export const VerifyEmailResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
})

export type VerifyEmailRequest = z.infer<typeof VerifyEmailRequestSchema>
export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>
