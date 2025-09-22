// Tax Server Actions - Tax information operations
'use server'

import { api } from '@/lib/api/config/axios-server'
import { API_ENDPOINTS } from '@/lib/constants'
import { revalidateTag } from 'next/cache'
import { CreateTaxInformationApiData } from '../_schemas/tax.schema'

// ===========================
// READ OPERATIONS (QUERIES)
// ===========================

/**
 * Get tax types list
 */
export async function getTaxTypesServerAction(): Promise<any> {
  try {
    const result = await api.get(API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.TYPES.LIST)
    return result
  } catch (error) {
    console.error('Error fetching tax types:', error)
    throw error
  }
}

/**
 * Get tax information for team
 */
export async function getTaxInformationServerAction(teamId: string): Promise<any> {
  try {
    const apiUrl = API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.INFORMATION.LIST.replace(
      '{team_group_id}',
      teamId,
    )
    const result = await api.get(apiUrl)
    return result
  } catch (error) {
    console.error('Error fetching tax information:', error)
    throw error
  }
}

/**
 * Get tax invoice receipt
 */
export async function getTaxInvoiceReceiptServerAction(teamId: string): Promise<any> {
  try {
    const apiUrl = API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.RECEIPT.LIST.replace(
      '{team_group_id}',
      teamId,
    )
    const result = await api.get(apiUrl)
    return result
  } catch (error) {
    console.error('Error fetching tax invoice receipt:', error)
    throw error
  }
}

// ===========================
// WRITE OPERATIONS (MUTATIONS)
// ===========================

/**
 * Create tax information
 */
export async function createTaxInformationServerAction(
  data: CreateTaxInformationApiData,
): Promise<any> {
  try {
    const result = await api.post(API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.INFORMATION.CREATE, data)

    // Revalidate tax-related cache
    revalidateTag('tax-information')
    revalidateTag(`tax-information-${data.team_group_id}`)

    return result
  } catch (error) {
    console.error('Error creating tax information:', error)
    throw error
  }
}

/**
 * Update tax information
 */
export async function updateTaxInformationServerAction(
  taxId: string,
  data: any, // Using any temporarily for type compatibility
): Promise<any> {
  try {
    const apiUrl = API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.INFORMATION.UPDATE.replace(
      '{team_group_id}',
      taxId,
    )
    const result = await api.put(apiUrl, data)

    // Revalidate tax-related cache
    revalidateTag('tax-information')
    revalidateTag(`tax-information-${taxId}`)

    return result
  } catch (error) {
    console.error('Error updating tax information:', error)
    throw error
  }
}

/**
 * Delete tax information
 */
export async function deleteTaxInformationServerAction(taxId: string): Promise<any> {
  try {
    const apiUrl = API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.INFORMATION.DELETE.replace('{id}', taxId)
    const result = await api.delete(apiUrl)

    // Revalidate tax-related cache
    revalidateTag('tax-information')
    revalidateTag(`tax-information-${taxId}`)

    return result
  } catch (error) {
    console.error('Error deleting tax information:', error)
    throw error
  }
}

/**
 * Create tax invoice receipt
 */
export async function createTaxInvoiceReceiptServerAction(
  data: any, // Using any temporarily for type compatibility
): Promise<any> {
  try {
    const result = await api.post(API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.RECEIPT.CREATE, data)

    // Revalidate tax-related cache
    revalidateTag('tax-invoice-receipt')

    return result
  } catch (error) {
    console.error('Error creating tax invoice receipt:', error)
    throw error
  }
}

/**
 * Update tax invoice receipt
 */
export async function updateTaxInvoiceReceiptServerAction(
  receiptId: string,
  data: any, // Using any temporarily for type compatibility
): Promise<any> {
  try {
    const apiUrl = API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.RECEIPT.UPDATE.replace(
      '{team_group_id}',
      receiptId,
    )
    const result = await api.put(apiUrl, data)

    // Revalidate tax-related cache
    revalidateTag('tax-invoice-receipt')
    revalidateTag(`tax-invoice-receipt-${receiptId}`)

    return result
  } catch (error) {
    console.error('Error updating tax invoice receipt:', error)
    throw error
  }
}

/**
 * Delete tax invoice receipt
 */
export async function deleteTaxInvoiceReceiptServerAction(receiptId: string): Promise<any> {
  try {
    const apiUrl = API_ENDPOINTS.TEAM_GROUPS.SETTINGS.TAX.RECEIPT.DELETE.replace('{id}', receiptId)
    const result = await api.delete(apiUrl)

    // Revalidate tax-related cache
    revalidateTag('tax-invoice-receipt')
    revalidateTag(`tax-invoice-receipt-${receiptId}`)

    return result
  } catch (error) {
    console.error('Error deleting tax invoice receipt:', error)
    throw error
  }
}
