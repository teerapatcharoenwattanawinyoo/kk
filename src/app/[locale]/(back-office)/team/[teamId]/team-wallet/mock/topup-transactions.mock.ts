import type {
  TopUpTransactionItem,
  TopUpTransactionsResponse,
} from '../_schemas/team-wallet-topup-transactions.schema'

// Mock data for top-up transactions
export const topUpTransactionsMockData: TopUpTransactionItem[] = [
  {
    id: 1,
    created_at: '2025-10-02T14:30:00Z',
    team_id: 'team-123',
    code: 'TP123456',
    payment_method: 'promptpay',
    amount: 1000,
    slip_file_path: '/files/topup/slip-1.png',
  },
  {
    id: 2,
    created_at: '2025-10-02T10:15:00Z',
    team_id: 'team-123',
    code: 'TP123457',
    payment_method: 'credit_card',
    amount: 2500,
    slip_file_path: '/files/topup/slip-2.png',
  },
  {
    id: 3,
    created_at: '2025-10-01T16:45:00Z',
    team_id: 'team-123',
    code: 'TP123458',
    payment_method: 'bank_transfer',
    amount: 5000,
    slip_file_path: '/files/topup/slip-3.png',
  },
  {
    id: 4,
    created_at: '2025-10-01T09:20:00Z',
    team_id: 'team-123',
    code: 'TP123459',
    payment_method: 'promptpay',
    amount: 1500,
    slip_file_path: null,
  },
  {
    id: 5,
    created_at: '2025-09-30T13:00:00Z',
    team_id: 'team-123',
    code: 'TP123460',
    payment_method: 'debit_card',
    amount: 3000,
    slip_file_path: '/files/topup/slip-5.png',
  },
  {
    id: 6,
    created_at: '2025-09-30T11:30:00Z',
    team_id: 'team-123',
    code: 'TP123461',
    payment_method: 'promptpay',
    amount: 800,
    slip_file_path: '/files/topup/slip-6.png',
  },
  {
    id: 7,
    created_at: '2025-09-29T15:10:00Z',
    team_id: 'team-123',
    code: 'TP123462',
    payment_method: 'bank_transfer',
    amount: 4500,
    slip_file_path: '/files/topup/slip-7.png',
  },
  {
    id: 8,
    created_at: '2025-09-29T08:45:00Z',
    team_id: 'team-123',
    code: 'TP123463',
    payment_method: 'credit_card',
    amount: 2000,
    slip_file_path: null,
  },
]

export const topUpTransactionsMockResponse: TopUpTransactionsResponse = {
  statusCode: 200,
  data: {
    items: topUpTransactionsMockData,
  },
  message: 'Success',
}
