import { z } from 'zod'

export const priceTypeSchema = z.enum(['PER_KWH', 'PER_MINUTE', 'PEAK', 'free'])
export type PriceType = z.infer<typeof priceTypeSchema>

export const statusTypeSchema = z.enum(['GENERAL', 'MEMBER'])
export type StatusType = z.infer<typeof statusTypeSchema>

export const modeSchema = z.enum(['add', 'edit'])
export type Mode = z.infer<typeof modeSchema>

export const formSchema = z.object({
  groupName: z.string().min(1, 'Group name is required'),
  status: z.string(),
})
export type FormData = z.infer<typeof formSchema>

export const priceFormSchema = z.object({
  pricePerKwh: z.string(),
  pricePerKwhMinute: z.string(),
  price_per_minute: z.string(),
  onPeakPrice: z.string(),
  offPeakPrice: z.string(),
  freeKw: z.string(),
  freeKwh: z.string(),
})
export type PriceFormData = z.infer<typeof priceFormSchema>

export const feeFormSchema = z.object({
  startingFeeDescription: z.string(),
  fee: z.string(),
  chargingFeeDescription: z.string(),
  feePrice: z.string(),
  applyAfterMinute: z.string(),
  minuteFeeDescription: z.string(),
  feePerMin: z.string(),
  applyFeeAfterMinute: z.string(),
  feeStopsAfterMinute: z.string(),
  idleFeeDescription: z.string(),
  feePerMinIdle: z.string(),
  timeBeforeIdleFeeApplied: z.string(),
  maxTotalIdleFee: z.string(),
})
export type FeeFormData = z.infer<typeof feeFormSchema>

export const priceGroupSubmissionSchema = z.object({
  form: formSchema,
  priceForm: priceFormSchema,
  feeForm: feeFormSchema,
  priceType: priceTypeSchema,
})
export type PriceGroupSubmissionData = z.infer<typeof priceGroupSubmissionSchema>

export const priceGroupFormInitialDataSchema = z.object({
  form: formSchema.partial().optional(),
  priceForm: priceFormSchema.partial().optional(),
  feeForm: feeFormSchema.partial().optional(),
  priceType: priceTypeSchema.optional(),
})
export type PriceGroupFormInitialData = z.infer<typeof priceGroupFormInitialDataSchema>

export interface PriceGroupFormProps {
  mode: Mode
  statusType: StatusType
  initialData?: PriceGroupFormInitialData
  isLoading?: boolean
  onSubmit: (data: PriceGroupSubmissionData) => Promise<void>
  onBack: () => void
  teamGroupId?: string | null
}
