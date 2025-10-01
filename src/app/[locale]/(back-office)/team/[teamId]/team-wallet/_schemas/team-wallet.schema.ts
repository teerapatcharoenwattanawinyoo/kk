import { z } from 'zod'

const ChargeSessionSchema = z.object({
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

const ChargeCardSchema = z.object({
  id: z.string(),
  cardId: z.string(),
  owner: z.string(),
  accessibility: z.string(),
  status: z.string(),
  created: z.string(),
})

export type ChargeCard = z.infer<typeof ChargeCardSchema>

const WalletBalanceSchema = z.number().nonnegative()

const TeamWalletSchema = z.object({
  walletBalance: WalletBalanceSchema,
  chargeSessions: z.array(ChargeSessionSchema),
  chargeCards: z.array(ChargeCardSchema),
})

export type TeamWalletData = z.infer<typeof TeamWalletSchema>

const TeamWalletBalanceDataSchema = z.object({
  walletBalance: WalletBalanceSchema,
})

const TeamWalletBalanceResponseSchema = z.object({
  statusCode: z.number().optional(),
  message: z.string().optional(),
  data: TeamWalletBalanceDataSchema,
})

export type TeamWalletBalanceData = z.infer<typeof TeamWalletBalanceDataSchema>
export type TeamWalletBalanceResponse = z.infer<typeof TeamWalletBalanceResponseSchema>

export {
  ChargeCardSchema,
  ChargeSessionSchema,
  TeamWalletBalanceDataSchema,
  TeamWalletBalanceResponseSchema,
  TeamWalletSchema,
  WalletBalanceSchema,
}
