import { useQuery } from '@tanstack/react-query'
import { TransactionListParams } from '../_schemas/transaction.schema'
import { getTransactionListServerAction } from '../_servers/transaction.actions'

// Query Keys
export const TRANSACTION_QUERY_KEYS = {
  TRANSACTION_LIST: 'transaction-list',
} as const

// Export types

// Hook สำหรับดึงรายการ transactions
export const useTransactionList = (params: TransactionListParams) => {
  return useQuery({
    queryKey: [TRANSACTION_QUERY_KEYS.TRANSACTION_LIST, params],
    queryFn: () => getTransactionListServerAction(params),
    enabled: !!params.teamId,
  })
}
