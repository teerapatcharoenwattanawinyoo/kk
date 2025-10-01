import { z } from 'zod'

import {
  topUpPaymentMethodSchema,
  topUpPresetAmountSchema,
  topUpTransactionGroupSchema,
  type TopUpPaymentMethod,
  type TopUpPresetAmount,
  type TopUpTransactionGroup,
} from '../_schemas/top-up.schema'

const presetAmountData = [
  300,
  500,
  700,
  3000,
  5000,
  7000,
  30000,
  50000,
  70000,
] as const satisfies ReadonlyArray<TopUpPresetAmount>

const paymentMethodData = [
  {
    id: 'promptpay',
    name: 'พร้อมเพย์',
    icon: '/assets/images/payment/prompPay.png',
    description: '(จ่ายได้ทุกธนาคาร)',
  },
] as const satisfies ReadonlyArray<TopUpPaymentMethod>

const transactionGroupData = [
  {
    date: '20 Nov 2025',
    items: [
      {
        id: '0x0000030',
        title: 'Top up',
        datetime: '20/11/2025 17:35 PM',
        amount: 3220,
        channel: 'PromptPay',
      },
      {
        id: '0x0000029',
        title: 'Top up',
        datetime: '20/11/2025 13:36 PM',
        amount: 220,
        channel: 'PromptPay',
      },
    ],
  },
  {
    date: '19 Nov 2025',
    items: [
      {
        id: '0x0000028',
        title: 'Top up',
        datetime: '19/11/2025 17:35 PM',
        amount: 220,
        channel: 'PromptPay',
      },
    ],
  },
] as const satisfies ReadonlyArray<TopUpTransactionGroup>

export const topUpPresetAmountsMock = z.array(topUpPresetAmountSchema).parse(presetAmountData)

export const topUpPaymentMethodsMock = z.array(topUpPaymentMethodSchema).parse(paymentMethodData)

export const topUpTransactionsMock = z.array(topUpTransactionGroupSchema).parse(transactionGroupData)
