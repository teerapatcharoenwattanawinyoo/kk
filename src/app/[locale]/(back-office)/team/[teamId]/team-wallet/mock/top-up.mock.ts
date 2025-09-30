import { z } from 'zod'

import {
  topUpPageDataSchema,
  topUpPaymentMethodSchema,
  TopUpPageData,
  TopUpPaymentMethod,
} from '../_schemas/top-up.schema'

const topUpPageData: TopUpPageData = topUpPageDataSchema.parse({
  presetAmounts: [300, 500, 700, 3000, 5000, 7000, 30000, 50000, 70000],
  transactionGroups: [
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
  ],
})

const topUpPaymentMethods: TopUpPaymentMethod[] = z
  .array(topUpPaymentMethodSchema)
  .parse([
    {
      id: 'promptpay',
      name: 'พร้อมเพย์',
      icon: '/assets/images/payment/prompPay.png',
      description: '(จ่ายได้ทุกธนาคาร)',
    },
  ])

export const topUpMockPageData = topUpPageData
export const topUpMockPaymentMethods = topUpPaymentMethods
