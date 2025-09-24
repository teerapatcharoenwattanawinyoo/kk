'use client'

import { BasePriceGroupForm } from '../../shared/price-group-form'
import type { BasePriceGroupFormProps } from '../../shared/price-group-form'

export type GeneralPriceGroupFormProps = Omit<BasePriceGroupFormProps, 'statusType'>

export default function GeneralPriceGroupForm(props: GeneralPriceGroupFormProps) {
  return <BasePriceGroupForm {...props} statusType="GENERAL" />
}
