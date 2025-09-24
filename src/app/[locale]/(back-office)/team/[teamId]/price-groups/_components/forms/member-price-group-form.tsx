'use client'

import PriceGroupForm from './price-group-form'
import type { PriceGroupFormProps } from './price-group-form'

export type {
  FeeFormData,
  FormData,
  Mode,
  PriceFormData,
  PriceType,
  StatusType,
} from './price-group-form'

export type MemberPriceGroupFormProps = Omit<PriceGroupFormProps, 'statusType'>

export default function MemberPriceGroupForm(props: MemberPriceGroupFormProps) {
  return <PriceGroupForm {...props} statusType="MEMBER" />
}
