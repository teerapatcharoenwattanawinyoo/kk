import { paymentMethodSchema, topUpTransactionGroupSchema } from '../types/top-up'

const paymentMethodsData = [
  {
    id: 'promptpay',
    name: 'พร้อมเพย์',
    icon: '/assets/images/payment/prompPay.png',
    description: '(จ่ายได้ทุกธนาคาร)',
  },
]

export const paymentMethodsMock = paymentMethodSchema.array().parse(paymentMethodsData)

const transactionGroupsData = [
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
]

export const topUpTransactionGroupsMock = topUpTransactionGroupSchema.array().parse(transactionGroupsData)
