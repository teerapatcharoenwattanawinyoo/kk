import {
  getTransactionListApi,
  type TransactionItem,
  type TransactionListParams,
  type TransactionListResponse,
} from '@/lib/api/team-group/transaction'
import { useQuery } from '@tanstack/react-query'

// Query Keys
export const TRANSACTION_QUERY_KEYS = {
  TRANSACTION_LIST: 'transaction-list',
} as const

// Export types
export type { TransactionItem, TransactionListParams, TransactionListResponse }

// Hook สำหรับดึงรายการ transactions
export const useTransactionList = (params: TransactionListParams) => {
  return useQuery({
    queryKey: [TRANSACTION_QUERY_KEYS.TRANSACTION_LIST, params],
    queryFn: () => getTransactionListApi(params),
    enabled: !!params.teamId,
  })
}
