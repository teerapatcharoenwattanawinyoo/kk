// src/app/[locale]/(auth)/create-profile/_schemas/create-profile.schema.ts
import { z } from 'zod'

// Form validation schema
export const CreateProfileFormSchema = z
  .object({
    profilename: z.string().min(1, { message: 'Profile name is required' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  })

// API request schema
export const CreateProfileRequestSchema = z.object({
  email: z.string().email().optional().nullable(),
  country_code: z.string().min(1),
  profilename: z.string().min(1),
  phone: z.string().optional().nullable(),
  password: z.string().min(1),
  token: z.string().min(1),
})

export const CreateProfileResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
})

export type CreateProfileFormData = z.infer<typeof CreateProfileFormSchema>
export type CreateProfileRequest = z.infer<typeof CreateProfileRequestSchema>
export type CreateProfileResponse = z.infer<typeof CreateProfileResponseSchema>
