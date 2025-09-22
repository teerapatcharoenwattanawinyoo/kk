import { createPaginatedSchema } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_schemas/chargers.schema'
import { z } from 'zod'

const stringFromNumber = z.union([z.string(), z.number()])
const nullableStringFromNumber = z
  .union([z.string(), z.number(), z.null()])
  .transform((value) => (value === null ? null : value.toString()))

const StartingFeeSchema = z
  .object({
    id: z.number().optional(),
    team_group_price_set_id: z.number().optional(),
    description: z.string().nullable().optional(),
    fee: stringFromNumber.transform((value) => value.toString()).optional(),
  })
  .passthrough()

const ChargingFeeSchema = z
  .object({
    id: z.number().optional(),
    team_group_price_set_id: z.number().optional(),
    description: z.string().nullable().optional(),
    fee_price: stringFromNumber.transform((value) => value.toString()).optional(),
    apply_after_minute: z.number().optional(),
  })
  .passthrough()

const MinuteFeeSchema = z
  .object({
    id: z.number().optional(),
    team_group_price_set_id: z.number().optional(),
    description: z.string().nullable().optional(),
    fee_per_min: stringFromNumber.transform((value) => value.toString()).optional(),
    apply_fee_after_minute: z.number().optional(),
    fee_stops_after_minute: z.number().nullable().optional(),
  })
  .passthrough()

const IdleFeeSchema = z
  .object({
    id: z.number().optional(),
    team_group_price_set_id: z.number().optional(),
    description: z.string().nullable().optional(),
    fee_per_min: stringFromNumber.transform((value) => value.toString()).optional(),
    time_before_idle_fee_applied: z.number().optional(),
    max_total_idle_fee: z.number().nullable().optional(),
  })
  .passthrough()

export const PriceGroupSchema = z
  .object({
    id: z.number(),
    team_group_id: z.number().nullable().optional(),
    customer_id: z.number().nullable().optional(),
    plug_id: z.number().nullable().optional(),
    charger_id: z.number().nullable().optional(),
    station_id: z.number().nullable().optional(),
    type: z.string(),
    price_per_kwh: nullableStringFromNumber.optional(),
    price_per_minute: nullableStringFromNumber.optional(),
    price_on_peak: nullableStringFromNumber.optional(),
    price_off_peak: nullableStringFromNumber.optional(),
    team_host_id: z.number().nullable().optional(),
    parent_id: z.number().nullable().optional(),
    name: z.string(),
    starting_fee: StartingFeeSchema.nullable().optional(),
    charging_fee: ChargingFeeSchema.nullable().optional(),
    minute_fee: MinuteFeeSchema.nullable().optional(),
    idle_fee: IdleFeeSchema.nullable().optional(),
  })
  .passthrough()

export type PriceGroup = z.infer<typeof PriceGroupSchema>

const PaginatedPriceGroupsSchema = createPaginatedSchema(PriceGroupSchema)

const LegacyPriceGroupsSchema = z.object({
  data: z.array(PriceGroupSchema),
  count: z.number().optional(),
})

export const PriceSetDataSchema = z.union([PaginatedPriceGroupsSchema, LegacyPriceGroupsSchema])

export type PriceSetData = z.infer<typeof PriceSetDataSchema>

export const PriceSetResponseSchema = z.object({
  statusCode: z.number(),
  data: PriceSetDataSchema,
  message: z.string(),
})

export type PriceSetResponse = z.infer<typeof PriceSetResponseSchema>

export const CreateByParentRequestSchema = z.object({
  parent_id: z.number(),
  plug_id: z.array(z.number()),
})

export type CreateByParentRequest = z.infer<typeof CreateByParentRequestSchema>

const MutationResultSchema = z.object({
  success: z.boolean(),
  message: z.string().nullable().optional(),
  id: z.number().optional(),
})

export const CreateByParentResponseSchema = z.object({
  statusCode: z.number(),
  data: MutationResultSchema.pick({ success: true, message: true }),
  message: z.string(),
})

export type CreateByParentResponse = z.infer<typeof CreateByParentResponseSchema>

export const CreatePriceRequestSchema = z.object({
  type: z.enum(['PER_KWH', 'PER_MINUTE', 'PEAK']),
  price_per_kwh: z.number().optional(),
  price_per_minute: z.number().optional(),
  price_on_peak: z.number().optional(),
  price_off_peak: z.number().optional(),
  team_group_id: z.number(),
  name: z.string(),
  status_type: z.enum(['GENERAL', 'MEMBER']).optional(),
  starting_fee: z
    .object({
      description: z.string(),
      fee: z.union([z.string(), z.number()]).transform((value) => value.toString()),
    })
    .optional(),
  charging_fee: z
    .object({
      description: z.string(),
      feePrice: z.union([z.string(), z.number()]).transform((value) => value.toString()),
      apply_after_minute: z.number(),
    })
    .optional(),
  minute_fee: z
    .object({
      description: z.string(),
      feePerMin: z.union([z.string(), z.number()]).transform((value) => value.toString()),
      apply_fee_after_minute: z.number(),
      fee_stops_after_minute: z.number().optional(),
    })
    .optional(),
  idle_fee: z
    .object({
      description: z.string(),
      feePerMin: z.union([z.string(), z.number()]).transform((value) => value.toString()),
      time_before_idle_fee_applied: z.number(),
      max_total_idle_fee: z.number().optional(),
    })
    .optional(),
})

export type CreatePriceRequest = z.infer<typeof CreatePriceRequestSchema>

export const CreatePriceResponseSchema = z.object({
  statusCode: z.number(),
  data: MutationResultSchema,
  message: z.string(),
})

export type CreatePriceResponse = z.infer<typeof CreatePriceResponseSchema>

export const UpdatePriceRequestSchema = CreatePriceRequestSchema.partial().extend({
  team_group_id: z.number().optional(),
  status_type: z.enum(['GENERAL', 'MEMBER']).optional(),
})

export type UpdatePriceRequest = z.infer<typeof UpdatePriceRequestSchema>

export const UpdatePriceResponseSchema = z.object({
  statusCode: z.number(),
  data: MutationResultSchema.pick({ success: true, message: true }).optional(),
  message: z.string(),
})

export type UpdatePriceResponse = z.infer<typeof UpdatePriceResponseSchema>
