import { createPaginatedSchema } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_schemas/chargers.schema'
import { z } from 'zod'

const stringFromNumber = z.union([z.string(), z.number()])
const nullableStringFromNumber = z
  .union([z.string(), z.number(), z.null()])
  .transform((value) => (value === null ? null : value.toString()))

const positiveIntSchema = z.number().int().positive()
const nonNegativeNumberSchema = z.number().min(0)
const nonNegativeIntSchema = z.number().int().min(0)
const teamHostIdSchema = z.union([z.number(), z.string()])

export const PriceSetTypeSchema = z.enum(['general', 'member'])
export type PriceSetType = z.infer<typeof PriceSetTypeSchema>

export const PriceGroupStartingFeePayloadSchema = z.object({
  description: z.string().min(1).optional(),
  fee: nonNegativeNumberSchema,
})

export const PriceGroupChargingFeePayloadSchema = z.object({
  description: z.string().min(1).optional(),
  fee: nonNegativeNumberSchema,
  apply_after_minute: nonNegativeIntSchema,
})

export const PriceGroupMinuteFeePayloadSchema = z.object({
  description: z.string().min(1).optional(),
  fee: nonNegativeNumberSchema,
  apply_fee_after_minute: nonNegativeIntSchema,
  fee_stops_after_minute: nonNegativeIntSchema.optional(),
})

export const PriceGroupIdleFeePayloadSchema = z.object({
  description: z.string().min(1).optional(),
  fee_per_min: nonNegativeNumberSchema,
  time_before_idle_fee_applied: nonNegativeIntSchema,
  max_total_idle_fee: nonNegativeNumberSchema.optional(),
})

export const PriceGroupPayloadSchema = z.object({
  type: z.enum(['PER_KWH', 'PER_MINUTE', 'PEAK', 'TIERED_CREDIT']),
  price_per_kwh: nonNegativeNumberSchema.optional(),
  price_per_minute: nonNegativeNumberSchema.optional(),
  price_on_peak: nonNegativeNumberSchema.optional(),
  price_off_peak: nonNegativeNumberSchema.optional(),
  team_group_id: positiveIntSchema,
  name: z.string().min(1),
  status_type: z.enum(['GENERAL', 'MEMBER']),
  starting_fee: PriceGroupStartingFeePayloadSchema.optional(),
  charging_fee: PriceGroupChargingFeePayloadSchema.optional(),
  minute_fee: PriceGroupMinuteFeePayloadSchema.optional(),
  idle_fee: PriceGroupIdleFeePayloadSchema.optional(),
})

export type PriceGroupPayload = z.infer<typeof PriceGroupPayloadSchema>

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
    max_total_idle_fee: z
      .union([z.string(), z.number(), z.null()])
      .transform((value) => (value === null ? null : value.toString()))
      .optional(),
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
    team_host_id: teamHostIdSchema.nullable().optional(),
    parent_id: z.number().nullable().optional(),
    name: z.string(),
    status: z.boolean().optional(),
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

const FlatPriceGroupsSchema = z.array(PriceGroupSchema)

export const PriceSetDataSchema = z.union([PaginatedPriceGroupsSchema, LegacyPriceGroupsSchema, FlatPriceGroupsSchema])

export type PriceSetData = z.infer<typeof PriceSetDataSchema>

export const PriceSetResponseSchema = z.object({
  statusCode: z.number().optional(),
  data: PriceSetDataSchema,
  message: z.string().optional(),
})

export type PriceSetResponse = z.infer<typeof PriceSetResponseSchema>

export const PriceGroupDetailResponseSchema = z.object({
  statusCode: z.number().optional(),
  data: PriceGroupSchema.nullable().optional(),
  message: z.string().optional(),
})

export type PriceGroupDetailResponse = z.infer<typeof PriceGroupDetailResponseSchema>

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

export const CreatePriceRequestSchema = PriceGroupPayloadSchema
export type CreatePriceRequest = z.infer<typeof CreatePriceRequestSchema>

export const PriceGroupMutationResponseSchema = z.object({
  statusCode: z.number().optional(),
  data: PriceGroupSchema.partial().optional(),
  message: z.string().optional(),
})

export type PriceGroupMutationResponse = z.infer<typeof PriceGroupMutationResponseSchema>

export const UpdatePriceRequestSchema = PriceGroupPayloadSchema
export type UpdatePriceRequest = z.infer<typeof UpdatePriceRequestSchema>

export const CreatePriceResponseSchema = PriceGroupMutationResponseSchema
export type CreatePriceResponse = PriceGroupMutationResponse

export const UpdatePriceResponseSchema = PriceGroupMutationResponseSchema
export type UpdatePriceResponse = PriceGroupMutationResponse
