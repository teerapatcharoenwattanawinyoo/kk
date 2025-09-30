import { z } from 'zod'

export const ChargeSessionSchema = z.object({
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

export type ChargeSession = z.infer<typeof ChargeSessionSchema>

export const ChargeCardSchema = z.object({
  id: z.string(),
  cardId: z.string(),
  owner: z.string(),
  accessibility: z.string(),
  status: z.string(),
  created: z.string(),
})

export type ChargeCard = z.infer<typeof ChargeCardSchema>

export const WalletBalanceSchema = z.number().nonnegative()

export const TeamWalletSchema = z.object({
  walletBalance: WalletBalanceSchema,
  chargeSessions: z.array(ChargeSessionSchema),
  chargeCards: z.array(ChargeCardSchema),
})

export type TeamWalletData = z.infer<typeof TeamWalletSchema>
