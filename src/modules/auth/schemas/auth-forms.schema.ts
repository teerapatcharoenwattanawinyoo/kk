import { z } from 'zod'

export const contactMethodSchema = z.enum(['phone', 'email'])

export const signInFormStateSchema = z.object({
  method: contactMethodSchema.default('phone'),
  phone: z.string().optional(),
  email: z.string().optional(),
  password: z.string().default(''),
  keepLoggedIn: z.boolean().default(false),
})

export const signInFormSchema = signInFormStateSchema
  .extend({
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  })
  .superRefine((value, ctx) => {
    if (value.method === 'phone' && !value.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phone number is required',
        path: ['phone'],
      })
    }

    if (value.method === 'email' && !value.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Email is required',
        path: ['email'],
      })
    }
  })

export const signUpFormStateSchema = z.object({
  method: contactMethodSchema.default('email'),
  email: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  acceptedTerms: z.boolean(),
})

const requireAcceptedTermsMessage =
  'Please accept the Privacy Policy and Terms Condition'

const withAcceptedTerms = <Schema extends z.ZodTypeAny>(schema: Schema) =>
  schema.superRefine((value, ctx) => {
    if (!value.acceptedTerms) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: requireAcceptedTermsMessage,
        path: ['acceptedTerms'],
      })
    }
  })

const signUpByEmailObjectSchema = signUpFormStateSchema.extend({
  method: z.literal('email'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
})

const signUpByPhoneObjectSchema = signUpFormStateSchema.extend({
  method: z.literal('phone'),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .min(1, 'Phone number is required'),
})

export const signUpByEmailSchema = withAcceptedTerms(signUpByEmailObjectSchema)

export const signUpByPhoneSchema = withAcceptedTerms(signUpByPhoneObjectSchema)

export const signUpFormSchema = withAcceptedTerms(
  z.discriminatedUnion('method', [
    signUpByEmailObjectSchema,
    signUpByPhoneObjectSchema,
  ]),
)

export const forgotPasswordRequestSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('phone'),
    phone: z
      .string({ required_error: 'Phone number is required' })
      .min(1, 'Phone number is required'),
  }),
  z.object({
    method: z.literal('email'),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address'),
  }),
])

const otpSchema = z
  .string({ required_error: 'OTP is required' })
  .length(6, 'OTP must be 6 digits')
  .regex(/^[0-9]+$/, 'OTP must contain only digits')

export const verifyOtpSchema = z.object({
  method: contactMethodSchema,
  otp: otpSchema,
  token: z.string({ required_error: 'Token is required' }),
  phone: z.string().optional(),
  email: z.string().optional(),
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .min(6, 'Confirm password must be at least 6 characters long'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      })
    }
  })

export const countryOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
})

export type ContactMethod = z.infer<typeof contactMethodSchema>
export type SignInFormState = z.infer<typeof signInFormStateSchema>
export type SignInFormInput = z.infer<typeof signInFormSchema>
export type SignUpFormState = z.infer<typeof signUpFormStateSchema>
export type SignUpByEmailInput = z.infer<typeof signUpByEmailSchema>
export type SignUpByPhoneInput = z.infer<typeof signUpByPhoneSchema>
export type SignUpFormInput = z.infer<typeof signUpFormSchema>
export type ForgotPasswordRequestInput = z.infer<typeof forgotPasswordRequestSchema>
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type CountryOption = z.infer<typeof countryOptionSchema>
