import { API_ENDPOINTS } from '@/lib/constants'
import {
  TransactionListParams,
  TransactionListResponse,
  validateTransactionListResponse,
} from '@/lib/schemas/transaction'
import {
  TransactionDetailParams,
  TransactionDetailResponse,
  validateTransactionDetailResponse,
} from '@/lib/schemas/transaction-detail'
import { api } from '../config/axios'
import { IResponse } from '../config/model'

export type {
  TransactionItem,
  TransactionListParams,
  TransactionListResponse,
} from '@/lib/schemas/transaction'

export type {
  Charge,
  ChargerPlugPower,
  Customer,
  PartnerStation,
  Payment,
  TransactionDetailData,
  TransactionDetailParams,
  TransactionDetailResponse,
} from '@/lib/schemas/transaction-detail'

export const getTransactionListApi = async (
  params?: TransactionListParams,
): Promise<IResponse<TransactionListResponse>> => {
  const queryParams = new URLSearchParams()

  if (params?.page) {
    queryParams.append('page', params.page.toString())
  }

  if (params?.pageSize) {
    queryParams.append('pageSize', params.pageSize.toString())
  }

  if (params?.search) {
    queryParams.append('search', params.search)
  }

  if (params?.teamId) {
    queryParams.append('teamId', params.teamId)
  }

  const url = queryParams.toString()
    ? `${API_ENDPOINTS.TEAM_GROUPS.TRANSACTIONS.LIST}?${queryParams.toString()}`
    : API_ENDPOINTS.TEAM_GROUPS.TRANSACTIONS.LIST

  const response = await api.get(url)

  const validation = validateTransactionListResponse(response.data)
  if (!validation.success) {
    console.warn('Transaction API response validation failed:', validation.error)
  }

  return response as IResponse<TransactionListResponse>
}

export const getTransactionDetailApi = async (
  params: TransactionDetailParams,
): Promise<IResponse<TransactionDetailResponse['data']>> => {
  const url = API_ENDPOINTS.TEAM_GROUPS.TRANSACTIONS.DETAIL.replace(
    '{transaction_id}',
    params.transaction_id,
  )

  const response = await api.get(url)

  const validation = validateTransactionDetailResponse(response.data)
  if (!validation.success) {
    console.warn('Transaction Detail API response validation failed:', validation.error)
  }

  return response as IResponse<TransactionDetailResponse['data']>
}

export const downloadTransactionApi = async (transactionId: string): Promise<Blob> => {
  const url = `/transaction/dashboard/download/${transactionId}`

  const response = await api.get(url, {
    responseType: 'blob',
  })

  return response as Blob
}
