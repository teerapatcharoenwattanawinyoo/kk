import { z } from 'zod'

// Payout Init Request Schema
export const payoutInitRequestSchema = z.object({
  team_group_id: z.number({
    required_error: 'Team group ID is required',
  }),
  amount: z.number().positive('Amount must be positive'),
  otp_type: z.enum(['phone', 'email'], {
    required_error: 'OTP type is required',
  }),
})

// Payout Init Response Schema
export const payoutInitResponseSchema = z.object({
  payout_transaction_id: z.number(),
  otp_ref: z.string(),
  expires_in: z.number(), // milliseconds (5 minutes)
})

// Payout Confirm Request Schema
export const payoutConfirmRequestSchema = z.object({
  payout_transaction_id: z.number().positive('Transaction ID is required'),
  otp_ref: z.string().min(1, 'OTP reference is required'),
  otp_code: z.string().min(1, 'OTP code is required'),
})

// Payout Confirm Response Schema
export const payoutConfirmResponseSchema = z.object({
  data: z.null(),
  message: z.string(),
})

// ==========================
// TYPESCRIPT TYPES
// ==========================
export type PayoutInitRequest = z.infer<typeof payoutInitRequestSchema>
export type PayoutInitResponse = z.infer<typeof payoutInitResponseSchema>
export type PayoutConfirmRequest = z.infer<typeof payoutConfirmRequestSchema>
export type PayoutConfirmResponse = z.infer<typeof payoutConfirmResponseSchema>
