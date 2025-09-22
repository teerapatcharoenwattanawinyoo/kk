import { z } from 'zod'

// === Query Parameters ===
export const transactionListParamsSchema = z.object({
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  teamId: z.string().min(1, 'Team ID is required'),
})

// === Transaction Item ===
export const transactionItemSchema = z.object({
  order_number: z.string(),
  charging_address: z.string(),
  charging_station: z.string(),
  longtitude: z.string(),
  latitude: z.string(),
  plug_id: z.string(),
  charger_id: z.string(),
  status: z.string(),
  tax_invoice: z.string(),
  start_charge_date: z.string(),
  start_charge_time: z.string(),
  stop_charge_date: z.string(),
  stop_charge_time: z.string(),
  time: z.string(),
  kwh: z.string(),
  meter_start: z.string(),
  meter_stop: z.string(),
  price: z.string(),
  charge_method: z.string(),
  payment_method: z.string(),
})

// === API Response ===
export const transactionListResponseSchema = z.object({
  page_current: z.number(),
  page_total: z.number(),
  page_size: z.number(),
  item_total: z.number(),
  data: z.array(transactionItemSchema),
})

// === Type Inference ===
export type TransactionListParams = z.infer<typeof transactionListParamsSchema>
export type TransactionItem = z.infer<typeof transactionItemSchema>
export type TransactionListResponse = z.infer<typeof transactionListResponseSchema>

// === Validation Helpers ===
export const validateTransactionListParams = (data: unknown) => {
  return transactionListParamsSchema.safeParse(data)
}

export const validateTransactionListResponse = (data: unknown) => {
  return transactionListResponseSchema.safeParse(data)
}
