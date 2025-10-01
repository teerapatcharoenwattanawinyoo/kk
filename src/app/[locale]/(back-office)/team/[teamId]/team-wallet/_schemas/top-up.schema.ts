import { z } from 'zod'

export const topUpPresetAmountSchema = z.number().int().nonnegative()

export const topUpTransactionSchema = z.object({
  id: z.string(),
  title: z.string(),
  datetime: z.string(),
  amount: z.number(),
  channel: z.string(),
})

export const topUpTransactionGroupSchema = z.object({
  date: z.string(),
  items: z.array(topUpTransactionSchema),
})

export const topUpPaymentMethodSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  description: z.string().optional(),
})

export type TopUpPresetAmount = z.infer<typeof topUpPresetAmountSchema>
export type TopUpTransaction = z.infer<typeof topUpTransactionSchema>
export type TopUpTransactionGroup = z.infer<typeof topUpTransactionGroupSchema>
export type TopUpPaymentMethod = z.infer<typeof topUpPaymentMethodSchema>
