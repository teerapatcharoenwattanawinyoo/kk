import { z } from 'zod'

// Transaction item schema - matching API response keys exactly
export const WalletTransactionItemSchema = z.object({
  id: z.number(),
  order_number: z.string(),
  charging_station: z.string(),
  charger_id: z.string(),
  rate: z.union([z.string(), z.number()]).transform((val) => String(val)),
  start_time: z.string(),
  end_time: z.string(),
  charging_time: z.string(),
  kwh: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  revenue: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  status: z.string(),
})

// Pagination metadata schema
export const PaginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  total_pages: z.number(),
})

// Response data schema
export const WalletTransactionsDataSchema = z.object({
  items: z.array(WalletTransactionItemSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  total_pages: z.number(),
})

// Full response schema
export const WalletTransactionsResponseSchema = z.object({
  statusCode: z.number(),
  data: WalletTransactionsDataSchema,
  message: z.string().optional(),
})

// Request params schema
export const WalletTransactionsRequestSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  filter_by_status: z.number().optional(),
})

// Types
export type WalletTransactionItem = z.infer<typeof WalletTransactionItemSchema>
export type WalletTransactionsData = z.infer<typeof WalletTransactionsDataSchema>
export type WalletTransactionsResponse = z.infer<typeof WalletTransactionsResponseSchema>
export type WalletTransactionsRequest = z.infer<typeof WalletTransactionsRequestSchema>
