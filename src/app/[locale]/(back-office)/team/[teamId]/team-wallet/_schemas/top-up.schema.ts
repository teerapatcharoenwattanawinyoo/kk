import { z } from 'zod'

const topUpPresetAmountSchema = z.number().int().nonnegative()

const topUpTransactionSchema = z.object({
  id: z.string(),
  title: z.string(),
  datetime: z.string(),
  amount: z.number(),
  channel: z.string(),
})

const topUpTransactionGroupSchema = z.object({
  date: z.string(),
  items: z.array(topUpTransactionSchema),
})

const topUpPaymentMethodSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  description: z.string().optional(),
})

export type TopUpPresetAmount = z.infer<typeof topUpPresetAmountSchema>
export type TopUpTransaction = z.infer<typeof topUpTransactionSchema>
export type TopUpTransactionGroup = z.infer<typeof topUpTransactionGroupSchema>
export type TopUpPaymentMethod = z.infer<typeof topUpPaymentMethodSchema>

export {
  topUpPaymentMethodSchema,
  topUpPresetAmountSchema,
  topUpTransactionGroupSchema,
  topUpTransactionSchema,
}
