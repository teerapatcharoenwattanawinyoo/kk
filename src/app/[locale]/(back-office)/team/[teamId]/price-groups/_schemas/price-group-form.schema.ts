import { z } from 'zod'

const trimmedInput = z
  .union([z.string(), z.number(), z.undefined(), z.null()])
  .transform((value) => {
    if (value === undefined || value === null) {
      return ''
    }
    return String(value).trim()
  })

export const PriceTypeSchema = z.enum(['PER_KWH', 'PER_MINUTE', 'PEAK', 'free'])
export type PriceType = z.infer<typeof PriceTypeSchema>

export const StatusTypeSchema = z.enum(['GENERAL', 'MEMBER'])
export type StatusType = z.infer<typeof StatusTypeSchema>

export const ModeSchema = z.enum(['add', 'edit'])
export type Mode = z.infer<typeof ModeSchema>

export const FormSchema = z.object({
  groupName: trimmedInput.pipe(
    z.string().min(1, { message: 'กรุณากรอกชื่อ Price Group' })
  ),
  status: trimmedInput.pipe(
    z.string().min(1, { message: 'กรุณาเลือกสถานะ' })
  ),
})
export type FormData = z.infer<typeof FormSchema>

export const PriceFormSchema = z.object({
  pricePerKwh: trimmedInput,
  pricePerKwhMinute: trimmedInput,
  price_per_minute: trimmedInput,
  onPeakPrice: trimmedInput,
  offPeakPrice: trimmedInput,
  freeKw: trimmedInput,
  freeKwh: trimmedInput,
})
export type PriceFormData = z.infer<typeof PriceFormSchema>

export const FeeFormSchema = z.object({
  startingFeeDescription: trimmedInput,
  fee: trimmedInput,
  chargingFeeDescription: trimmedInput,
  feePrice: trimmedInput,
  applyAfterMinute: trimmedInput,
  minuteFeeDescription: trimmedInput,
  feePerMin: trimmedInput,
  applyFeeAfterMinute: trimmedInput,
  feeStopsAfterMinute: trimmedInput,
  idleFeeDescription: trimmedInput,
  feePerMinIdle: trimmedInput,
  timeBeforeIdleFeeApplied: trimmedInput,
  maxTotalIdleFee: trimmedInput,
})
export type FeeFormData = z.infer<typeof FeeFormSchema>

const priceTypeRequirements: Record<
  PriceType,
  Array<{ field: keyof PriceFormData; label: string }>
> = {
  PER_KWH: [{ field: 'pricePerKwh', label: 'บาท/kWh' }],
  PER_MINUTE: [
    { field: 'pricePerKwhMinute', label: 'บาท/kWh' },
    { field: 'price_per_minute', label: '/ชั่วโมง' },
  ],
  PEAK: [
    { field: 'onPeakPrice', label: 'On Peak บาท/kWh' },
    { field: 'offPeakPrice', label: 'Off Peak บาท/kWh' },
  ],
  free: [
    { field: 'freeKw', label: 'Free kW' },
    { field: 'freeKwh', label: 'หลังจากชาร์จฟรี บาท/kWh' },
  ],
}

export const PriceGroupFormSubmissionSchema = z
  .object({
    form: FormSchema,
    priceForm: PriceFormSchema,
    feeForm: FeeFormSchema,
    priceType: PriceTypeSchema,
  })
  .superRefine((data, ctx) => {
    const missingFields = priceTypeRequirements[data.priceType].filter(
      ({ field }) => !data.priceForm[field]
    )

    if (missingFields.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['priceForm'],
        message: `กรุณากรอกข้อมูลให้ครบถ้วน: ${missingFields
          .map(({ label }) => label)
          .join(', ')}`,
      })
    }
  })

export type PriceGroupFormSubmission = z.infer<
  typeof PriceGroupFormSubmissionSchema
>

export interface PriceGroupFormInitialData {
  form?: Partial<FormData>
  priceForm?: Partial<PriceFormData>
  feeForm?: Partial<FeeFormData>
  priceType?: PriceType
}

export interface PriceGroupFormProps {
  mode: Mode
  statusType: StatusType
  initialData?: PriceGroupFormInitialData
  isLoading?: boolean
  onSubmit: (data: PriceGroupFormSubmission) => Promise<void>
  onBack: () => void
  teamGroupId?: string | null
}
