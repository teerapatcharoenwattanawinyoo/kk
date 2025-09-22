import { useMutation, useQuery } from '@tanstack/react-query'
import { TransactionDetailParams } from '../_schemas/transaction-detail.schema'
import {
  downloadTransactionServerAction,
  getTransactionDetailServerAction,
} from '../_servers/transaction.actions'

// Query Keys
export const TRANSACTION_DETAIL_QUERY_KEYS = {
  TRANSACTION_DETAIL: 'transaction-detail',
} as const

// Hook สำหรับดึงข้อมูล transaction detail
export const useTransactionDetail = (params: TransactionDetailParams) => {
  return useQuery({
    queryKey: [TRANSACTION_DETAIL_QUERY_KEYS.TRANSACTION_DETAIL, params],
    queryFn: () => getTransactionDetailServerAction(params),
    enabled: !!params.transaction_id,
  })
}

// Hook สำหรับ download transaction
export const useDownloadTransaction = () => {
  return useMutation<Blob, Error, string>({
    mutationFn: (transactionId: string) => downloadTransactionServerAction(transactionId),
    onSuccess: (blob, transactionId) => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `transaction_${transactionId}.pdf`
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
    onError: (error) => {
      console.error('Download failed:', error)
      // You can add toast notification here
    },
  })
}
