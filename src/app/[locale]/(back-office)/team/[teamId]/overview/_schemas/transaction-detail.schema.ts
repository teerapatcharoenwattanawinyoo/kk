import { z } from 'zod'

// === Partner Station Schema ===
export const partnerStationSchema = z.object({
  charge_point: z.string(),
  address: z.string(),
  longtitude: z.string(),
  latitude: z.string(),
})

// === Customer Schema ===
export const customerSchema = z.object({
  charge_by: z.string(),
})

// === Charger Plug Power Schema ===
export const chargerPlugPowerSchema = z.object({
  plug_id: z.number(),
})

// === Payment Schema ===
export const paymentSchema = z.object({
  card_id: z.string(),
  tokenization: z.string(),
  customer: z.string(),
  country: z.string(),
  card_number: z.string(),
  type: z.string(),
  name: z.string(),
  financing: z.string(),
  expiry_date: z.string(),
  card_status: z.string(),
})

// === Charge Schema ===
export const chargeSchema = z.object({
  id: z.string(),
  order_number: z.string(),
  header_number: z.string(),
  charge_start_at: z.string(),
  charge_end_at: z.string(),
  total_kwh: z.string(),
  transaction_amount: z.string(),
  rate: z.string().nullable(),
  paying_team: z.string().nullable(),
  price_type: z.string().nullable(),
  payment_method: z.string(),
  kwh_limit: z.string(),
  charge_method: z.string(),
  stop_reason: z.string(),
  status: z.string(),
  receipt_file: z.string(),
  meter_start: z.string(),
  soc_start_rate: z.string(),
  meter_stop: z.string(),
  soc_stop_rate: z.string(),
  soc_start_at: z.string(),
  soc_stop_at: z.string(),
  vat_charge: z.string(),
  fee: z.string().nullable(),
  net_amount: z.string(),
  transaction_fee: z.string(),
  partner_station: partnerStationSchema,
  customer: customerSchema,
  charger_plug_power: chargerPlugPowerSchema,
})

// === Transaction Detail Data Schema ===
export const transactionDetailDataSchema = z.object({
  charge: chargeSchema,
  payment: paymentSchema,
})

// === Transaction Detail Response Schema ===
export const transactionDetailResponseSchema = z.object({
  statusCode: z.number(),
  data: transactionDetailDataSchema,
  message: z.string(),
})

// === Query Parameters ===
export const transactionDetailParamsSchema = z.object({
  transaction_id: z.string().min(1, 'Transaction ID is required'),
})

// === Type Inference ===
export type PartnerStation = z.infer<typeof partnerStationSchema>
export type Customer = z.infer<typeof customerSchema>
export type ChargerPlugPower = z.infer<typeof chargerPlugPowerSchema>
export type Payment = z.infer<typeof paymentSchema>
export type Charge = z.infer<typeof chargeSchema>
export type TransactionDetailData = z.infer<typeof transactionDetailDataSchema>
export type TransactionDetailResponse = z.infer<
  typeof transactionDetailResponseSchema
>
export type TransactionDetailParams = z.infer<
  typeof transactionDetailParamsSchema
>

// === Validation Helpers ===
export const validateTransactionDetailParams = (data: unknown) => {
  return transactionDetailParamsSchema.safeParse(data)
}

export const validateTransactionDetailResponse = (data: unknown) => {
  return transactionDetailResponseSchema.safeParse(data)
}
