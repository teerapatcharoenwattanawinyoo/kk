// src/app/[locale]/(auth)/sign-in/_schemas/signin-schema.ts
import { z } from 'zod'
import { userSchema } from '@/lib/schemas/user.schema'

export const SignInSchema = z
  .object({
    email: z.string().email('Invalid email').optional(),
    phone: z.string().min(3, 'Invalid phone').optional(),
    password: z.string().min(1, 'Password is required'),
    method: z.enum(['phone', 'email']).optional(),
  })
  .refine((val) => !!val.email || !!val.phone, {
    message: 'Either email or phone is required',
    path: ['email'],
  })

export type SignInInput = z.infer<typeof SignInSchema>

// Expected backend response wrapper for sign-in
export const BackendLoginDataSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: z.unknown(),
})

export const BackendLoginSchema = z.object({
  statusCode: z.number(),
  message: z.string().optional(),
  data: z
    .union([
      BackendLoginDataSchema,
      z.string(),
      z.null(),
      z.undefined(),
    ])
    .optional(),
})

// Normalized login response used by FE after internal route
export const LoginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: userSchema,
})

export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type BackendLoginData = z.infer<typeof BackendLoginDataSchema>
