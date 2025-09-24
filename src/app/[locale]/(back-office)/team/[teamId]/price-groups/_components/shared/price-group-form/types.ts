export type PriceType = 'PER_KWH' | 'PER_MINUTE' | 'PEAK' | 'free'
export type StatusType = 'GENERAL' | 'MEMBER'
export type Mode = 'add' | 'edit'

export interface FormData {
  groupName: string
  status: string
}

export interface PriceFormData {
  pricePerKwh: string
  pricePerKwhMinute: string
  price_per_minute: string
  onPeakPrice: string
  offPeakPrice: string
  freeKw: string
  freeKwh: string
}

export interface FeeFormData {
  startingFeeDescription: string
  fee: string
  chargingFeeDescription: string
  feePrice: string
  applyAfterMinute: string
  minuteFeeDescription: string
  feePerMin: string
  applyFeeAfterMinute: string
  feeStopsAfterMinute: string
  idleFeeDescription: string
  feePerMinIdle: string
  timeBeforeIdleFeeApplied: string
  maxTotalIdleFee: string
}

export interface PriceGroupFormInitialData {
  form?: Partial<FormData>
  priceForm?: Partial<PriceFormData>
  feeForm?: Partial<FeeFormData>
  priceType?: PriceType
}

export interface PriceGroupFormSubmitData {
  form: FormData
  priceForm: PriceFormData
  feeForm: FeeFormData
  priceType: PriceType
}

export interface BasePriceGroupFormProps {
  mode: Mode
  statusType: StatusType
  initialData?: PriceGroupFormInitialData
  isLoading?: boolean
  onSubmit: (data: PriceGroupFormSubmitData) => Promise<void>
  onBack: () => void
  teamGroupId?: string | null
}
