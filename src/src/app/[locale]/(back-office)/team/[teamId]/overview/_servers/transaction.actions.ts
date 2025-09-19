// Transaction Server Actions - Transaction operations
'use server'

import { api } from '@/lib/api/config/axios-server'
import { API_ENDPOINTS } from '@/lib/constants'
import { type TransactionDetailParams } from '../_schemas/transaction-detail.schema'
import {
  type TransactionListParams,
} from '../_schemas/transaction.schema'

// ===========================
// READ OPERATIONS (QUERIES)
// ===========================

/**
 * Get transaction list with pagination
 */
export async function getTransactionListServerAction(
  params?: TransactionListParams,
): Promise<any> {
  try {
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

    const apiUrl = queryParams.toString()
      ? `${API_ENDPOINTS.TEAM_GROUPS.TRANSACTIONS.LIST}?${queryParams.toString()}`
      : API_ENDPOINTS.TEAM_GROUPS.TRANSACTIONS.LIST

    const result = await api.get(apiUrl)
    return result
  } catch (error) {
    console.error('Error fetching transaction list:', error)
    throw error
  }
}

/**
 * Get transaction detail by ID
 */
export async function getTransactionDetailServerAction(
  params: TransactionDetailParams,
): Promise<any> {
  try {
    const apiUrl = API_ENDPOINTS.TEAM_GROUPS.TRANSACTIONS.DETAIL.replace(
      '{transaction_id}',
      params.transaction_id,
    )

    const result = await api.get(apiUrl)
    return result
  } catch (error) {
    console.error('Error fetching transaction detail:', error)
    throw error
  }
}

/**
 * Download transaction as PDF
 */
export async function downloadTransactionServerAction(
  transactionId: string,
): Promise<Blob> {
  try {
    const apiUrl = `/transaction/dashboard/download/${transactionId}`

    const result = await api.get(apiUrl, {
      responseType: 'blob',
    })
    return result as Blob
  } catch (error) {
    console.error('Error downloading transaction:', error)
    throw error
  }
}