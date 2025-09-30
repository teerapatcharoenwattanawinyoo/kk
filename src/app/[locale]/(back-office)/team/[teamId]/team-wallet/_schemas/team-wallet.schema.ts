import { z } from 'zod'

export const chargeSessionSchema = z.object({
  orderNumber: z.string(),
  location: z.string(),
  station: z.string(),
  charger: z.string(),
  rate: z.string(),
  startCharge: z.string(),
  stopCharge: z.string(),
  time: z.string(),
  kWh: z.string(),
  revenue: z.string(),
  status: z.string(),
})

export type ChargeSession = z.infer<typeof chargeSessionSchema>

export const chargeCardSchema = z.object({
  id: z.string(),
  cardId: z.string(),
  owner: z.string(),
  accessibility: z.string(),
  status: z.string(),
  created: z.string(),
})

export type ChargeCard = z.infer<typeof chargeCardSchema>

export const teamWalletDataSchema = z.object({
  walletBalance: z.number(),
  chargeSessions: z.array(chargeSessionSchema),
  chargeCards: z.array(chargeCardSchema),
})

export type TeamWalletData = z.infer<typeof teamWalletDataSchema>
