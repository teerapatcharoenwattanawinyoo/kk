// Bank Server Actions - Bank account operations
'use server'

import { api } from '@/lib/api/config/axios'
import {
  type IBankAccount,
  type IBankAccountUpdate,
} from '@/lib/api/team-group/bank'
import { API_ENDPOINTS } from '@/lib/constants'
import { revalidateTag } from 'next/cache'

// ===========================
// READ OPERATIONS (QUERIES)
// ===========================

/**
 * Get all bank accounts for a team
 */
export async function getBankAccountsServerAction(
  team_group_id: string,
): Promise<any> {
  try {
    const apiUrl = API_ENDPOINTS.TEAM_GROUPS.REVENUE.BANK.LIST.replace(
      '{team_group_id}', 
      team_group_id
    )
    const result = await api.get(apiUrl)
    return result
  } catch (error) {
    console.error('Error fetching bank accounts:', error)
    throw error
  }
}

/**
 * Get bank account by ID
 */
export async function getBankAccountByIdServerAction(
  id: number,
): Promise<any> {
  try {
    const apiUrl = API_ENDPOINTS.TEAM_GROUPS.REVENUE.BANK.GET_BY_ID.replace(
      '{id}', 
      id.toString()
    )
    const result = await api.get(apiUrl)
    return result
  } catch (error) {
    console.error('Error fetching bank account by ID:', error)
    throw error
  }
}

/**
 * Get available banks list
 */
export async function getBankListsServerAction(): Promise<any> {
  try {
    const result = await api.get(API_ENDPOINTS.TEAM_GROUPS.REVENUE.BANK.BANK_LISTS)
    return result
  } catch (error) {
    console.error('Error fetching bank lists:', error)
    throw error
  }
}

// ===========================
// WRITE OPERATIONS (MUTATIONS)
// ===========================

/**
 * Create bank account
 */
export async function createBankAccountServerAction(
  data: IBankAccount,
): Promise<any> {
  try {
    const result = await api.post(API_ENDPOINTS.TEAM_GROUPS.REVENUE.BANK.CREATE, data)
    
    // Revalidate bank-related cache
    revalidateTag('bank-accounts')
    
    return result
  } catch (error) {
    console.error('Error creating bank account:', error)
    throw error
  }
}

/**
 * Update bank account
 */
export async function updateBankAccountServerAction(
  id: number,
  data: IBankAccountUpdate,
): Promise<any> {
  try {
    const apiUrl = API_ENDPOINTS.TEAM_GROUPS.REVENUE.BANK.UPDATE.replace(
      '{id}', 
      id.toString()
    )
    const result = await api.put(apiUrl, data)
    
    // Revalidate bank-related cache
    revalidateTag('bank-accounts')
    revalidateTag(`bank-account-${id}`)
    
    return result
  } catch (error) {
    console.error('Error updating bank account:', error)
    throw error
  }
}

/**
 * Delete bank account
 */
export async function deleteBankAccountServerAction(id: number): Promise<any> {
  try {
    const apiUrl = API_ENDPOINTS.TEAM_GROUPS.REVENUE.BANK.DELETE.replace(
      '{id}', 
      id.toString()
    )
    const result = await api.delete(apiUrl)
    
    // Revalidate bank-related cache
    revalidateTag('bank-accounts')
    revalidateTag(`bank-account-${id}`)
    
    return result
  } catch (error) {
    console.error('Error deleting bank account:', error)
    throw error
  }
}