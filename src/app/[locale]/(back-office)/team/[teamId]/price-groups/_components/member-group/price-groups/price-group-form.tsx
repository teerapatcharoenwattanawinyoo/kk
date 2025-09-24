'use client'

import { BasePriceGroupForm } from '../../shared/price-group-form'
import type { BasePriceGroupFormProps } from '../../shared/price-group-form'

export type MemberPriceGroupFormProps = Omit<BasePriceGroupFormProps, 'statusType'>

export default function MemberPriceGroupForm(props: MemberPriceGroupFormProps) {
  return <BasePriceGroupForm {...props} statusType="MEMBER" />
}
