import { z } from 'zod'

export const paymentMethodSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  description: z.string().optional(),
})

export type PaymentMethod = z.infer<typeof paymentMethodSchema>

export const topUpTransactionSchema = z.object({
  id: z.string(),
  title: z.string(),
  datetime: z.string(),
  amount: z.number(),
  channel: z.string(),
})

export type TopUpTransaction = z.infer<typeof topUpTransactionSchema>

export const topUpTransactionGroupSchema = z.object({
  date: z.string(),
  items: z.array(topUpTransactionSchema),
})

export type TopUpTransactionGroup = z.infer<typeof topUpTransactionGroupSchema>
