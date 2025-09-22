// src/app/[locale]/(auth)/sign-up/_schemas/sign-up.schema.ts
import { z } from 'zod'

// Form validation schemas
export const SignUpFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  country: z.string().min(1, { message: 'Please select your country' }),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({
      message: 'Please accept the Privacy Policy and Terms Condition',
    }),
  }),
})

export const PhoneFormSchema = z.object({
  phone: z.string().min(1, { message: 'Please enter your phone number' }),
  country: z.string().min(1, { message: 'Please select your country' }),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({
      message: 'Please accept the Privacy Policy and Terms Condition',
    }),
  }),
})

// Register by email
export const RegisterByEmailRequestSchema = z.object({
  email: z.string().email(),
  country_code: z.string().min(1),
})

export const RegisterByEmailDataSchema = z.object({
  message: z.string(),
  userId: z.number(),
  token: z.string(),
  otpRef: z.string().optional(), // Add otpRef field
})

export const RegisterByEmailResponseSchema = z.object({
  statusCode: z.number(),
  data: RegisterByEmailDataSchema,
  message: z.string(),
})

export type SignUpFormData = z.infer<typeof SignUpFormSchema>
export type PhoneFormData = z.infer<typeof PhoneFormSchema>
export type RegisterByEmailRequest = z.infer<typeof RegisterByEmailRequestSchema>
export type RegisterByEmailResponse = z.infer<typeof RegisterByEmailResponseSchema>

// Register by phone
export const RegisterByPhoneRequestSchema = z.object({
  phone: z.string().min(1),
  country_code: z.string().min(1),
})

export const RegisterByPhoneDataSchema = z.object({
  message: z.string(),
  userId: z.number(),
  token: z.string(),
  otpRef: z.string().optional(), // Add otpRef field
})

export const RegisterByPhoneResponseSchema = z.object({
  statusCode: z.number(),
  data: RegisterByPhoneDataSchema,
  message: z.string(),
})

export type RegisterByPhoneRequest = z.infer<typeof RegisterByPhoneRequestSchema>
export type RegisterByPhoneResponse = z.infer<typeof RegisterByPhoneResponseSchema>
