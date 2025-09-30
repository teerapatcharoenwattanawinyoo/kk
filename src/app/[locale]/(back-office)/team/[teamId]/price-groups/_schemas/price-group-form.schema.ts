import { z } from 'zod'
import type { PriceGroupPayload } from './price-groups-api.schema'

const trimmedInput = z
  .union([z.string(), z.number(), z.undefined(), z.null()])
  .transform((value) => {
    if (value === undefined || value === null) {
      return ''
    }
    return String(value).trim()
  })

export const PriceTypeSchema = z.enum(['PER_KWH', 'PER_MINUTE', 'PEAK', 'free', 'TIERED_CREDIT'])
export type PriceType = z.infer<typeof PriceTypeSchema>

export const BillingTypeSchema = z.enum(['USAGE', 'CREDIT'])
export type BillingType = z.infer<typeof BillingTypeSchema>

export const StatusTypeSchema = z.enum(['GENERAL', 'MEMBER'])
export type StatusType = z.infer<typeof StatusTypeSchema>

export const ModeSchema = z.enum(['add', 'edit'])
export type Mode = z.infer<typeof ModeSchema>

export const FormSchema = z.object({
  groupName: trimmedInput.pipe(z.string().min(1, { message: 'กรุณากรอกชื่อ Price Group' })),
  status: trimmedInput.pipe(z.string().min(1, { message: 'กรุณาเลือกสถานะ' })),
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
  TIERED_CREDIT: [],
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
      ({ field }) => !data.priceForm[field],
    )

    if (missingFields.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['priceForm'],
        message: `กรุณากรอกข้อมูลให้ครบถ้วน: ${missingFields.map(({ label }) => label).join(', ')}`,
      })
    }
  })

export type PriceGroupFormSubmission = z.infer<typeof PriceGroupFormSubmissionSchema>

export interface PriceGroupFormInitialData {
  form?: Partial<FormData>
  priceForm?: Partial<PriceFormData>
  feeForm?: Partial<FeeFormData>
  priceType?: PriceType
  billingDay?: number | string | null
  billingType?: BillingType | null
}

export interface PriceGroupFormProps {
  mode: Mode
  statusType: StatusType
  initialData?: PriceGroupFormInitialData
  isLoading?: boolean
  onSubmit: (data: PriceGroupFormSubmission) => Promise<void>
  onBack: () => void
  teamGroupId?: string | null
  billingType?: BillingType
}

const hasText = (value?: string | null): value is string =>
  typeof value === 'string' && value.trim().length > 0

const parseNumber = (value?: string | null): number | undefined => {
  if (!hasText(value)) {
    return undefined
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const parseInteger = (value?: string | null, fallback = 0): number => {
  if (!hasText(value)) {
    return fallback
  }
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

const resolvePayloadType = (priceType: PriceType): PriceGroupPayload['type'] =>
  priceType === 'free' ? 'PER_KWH' : priceType

const buildStartingFee = (
  priceType: PriceType,
  freeKw: string,
  feeDescription: string,
  feeValue: string,
  freeKwhValue: string,
): PriceGroupPayload['starting_fee'] | undefined => {
  if (priceType === 'free') {
    const freeDescription = hasText(freeKw) ? `Free ${freeKw.trim()} kW charge` : undefined
    const combinedDescription = [
      freeDescription,
      hasText(feeDescription) ? feeDescription.trim() : undefined,
    ]
      .filter(Boolean)
      .join(', ')

    return {
      ...(hasText(combinedDescription) ? { description: combinedDescription } : {}),
      fee: parseNumber(freeKwhValue) ?? 0,
    }
  }

  const fee = parseNumber(feeValue)
  if (fee === undefined) {
    return undefined
  }

  return {
    ...(hasText(feeDescription) ? { description: feeDescription.trim() } : {}),
    fee,
  }
}

export const submissionToPriceGroupPayload = (
  submission: PriceGroupFormSubmission,
  statusType: StatusType,
  teamGroupId: number,
): PriceGroupPayload => {
  const { form, priceForm, feeForm, priceType } = submission
  const type = resolvePayloadType(priceType)

  const payload: PriceGroupPayload = {
    type,
    name: form.groupName.trim(),
    status_type: statusType,
    team_group_id: teamGroupId,
  }

  if (type === 'PER_KWH' || type === 'TIERED_CREDIT') {
    const source = priceType === 'free' ? priceForm.freeKwh : priceForm.pricePerKwh
    const pricePerKwh = parseNumber(source)
    if (pricePerKwh !== undefined) {
      payload.price_per_kwh = pricePerKwh
    }
  }

  if (type === 'PER_MINUTE') {
    const pricePerKwh = parseNumber(priceForm.pricePerKwhMinute)
    const pricePerMinute = parseNumber(priceForm.price_per_minute)
    if (pricePerKwh !== undefined) {
      payload.price_per_kwh = pricePerKwh
    }
    if (pricePerMinute !== undefined) {
      payload.price_per_minute = pricePerMinute
    }
  }

  if (type === 'PEAK') {
    const onPeak = parseNumber(priceForm.onPeakPrice)
    const offPeak = parseNumber(priceForm.offPeakPrice)
    if (onPeak !== undefined) {
      payload.price_on_peak = onPeak
    }
    if (offPeak !== undefined) {
      payload.price_off_peak = offPeak
    }
  }

  const startingFee = buildStartingFee(
    priceType,
    priceForm.freeKw,
    feeForm.startingFeeDescription,
    feeForm.fee,
    priceForm.freeKwh,
  )

  if (startingFee) {
    payload.starting_fee = startingFee
  }

  const chargingFeeValue = parseNumber(feeForm.feePrice)
  if (chargingFeeValue !== undefined) {
    payload.charging_fee = {
      ...(hasText(feeForm.chargingFeeDescription)
        ? { description: feeForm.chargingFeeDescription.trim() }
        : {}),
      fee: chargingFeeValue,
      apply_after_minute: parseInteger(feeForm.applyAfterMinute, 0),
    }
  }

  const minuteFeeValue = parseNumber(feeForm.feePerMin)
  if (minuteFeeValue !== undefined) {
    const feeStopsAfterMinute = parseInteger(feeForm.feeStopsAfterMinute, -1)
    payload.minute_fee = {
      ...(hasText(feeForm.minuteFeeDescription)
        ? { description: feeForm.minuteFeeDescription.trim() }
        : {}),
      fee: minuteFeeValue,
      apply_fee_after_minute: parseInteger(feeForm.applyFeeAfterMinute, 0),
      ...(feeStopsAfterMinute >= 0 ? { fee_stops_after_minute: feeStopsAfterMinute } : {}),
    }
  }

  const idleFeeValue = parseNumber(feeForm.feePerMinIdle)
  if (idleFeeValue !== undefined) {
    const maxTotalIdleFee = parseNumber(feeForm.maxTotalIdleFee)
    payload.idle_fee = {
      ...(hasText(feeForm.idleFeeDescription)
        ? { description: feeForm.idleFeeDescription.trim() }
        : {}),
      fee_per_min: idleFeeValue,
      time_before_idle_fee_applied: parseInteger(feeForm.timeBeforeIdleFeeApplied, 0),
      ...(maxTotalIdleFee !== undefined ? { max_total_idle_fee: maxTotalIdleFee } : {}),
    }
  }

  return payload
}
