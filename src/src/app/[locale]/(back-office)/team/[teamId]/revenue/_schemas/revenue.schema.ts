import { z } from 'zod'

// Revenue Balance Response Schema (จาก API response)
export const revenueBalanceResponseSchema = z.object({
  available_balance: z.number(),
  onhold_balance: z.number(),
  transfer_balance: z.number(),
  reserve_balance: z.number(),
  last_withdraw: z.string().nullable(),
  bank_name: z.string().nullable(),
  bank_account: z.string().nullable(),
  bank_account_name: z.string().nullable(),
})

// ==========================
// TYPESCRIPT TYPES
// ==========================
export type RevenueBalanceResponse = z.infer<
  typeof revenueBalanceResponseSchema
>
