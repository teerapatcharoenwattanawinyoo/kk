import { z } from 'zod'

// Top-up transaction item schema
export const TopUpTransactionItemSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  team_id: z.string(),
  code: z.string(),
  payment_method: z.string(),
  amount: z.number(),
  slip_file_path: z.string().nullable().optional(),
})

export type TopUpTransactionItem = z.infer<typeof TopUpTransactionItemSchema>

// Top-up transactions data schema
export const TopUpTransactionsDataSchema = z.object({
  items: z.array(TopUpTransactionItemSchema),
})

export type TopUpTransactionsData = z.infer<typeof TopUpTransactionsDataSchema>

// Top-up transactions response schema
export const TopUpTransactionsResponseSchema = z.object({
  statusCode: z.number(),
  data: TopUpTransactionsDataSchema,
  message: z.string().optional(),
})

export type TopUpTransactionsResponse = z.infer<typeof TopUpTransactionsResponseSchema>

// Request parameters schema (if needed for filters)
export const TopUpTransactionsRequestSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
  search: z.string().optional(),
})

export type TopUpTransactionsRequest = z.infer<typeof TopUpTransactionsRequestSchema>
