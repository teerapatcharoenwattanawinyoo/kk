import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { IBankAccount, IBankAccountUpdate } from '../_schemas/bank.schema'
import {
  createBankAccountServerAction,
  deleteBankAccountServerAction,
  getBankAccountByIdServerAction,
  getBankAccountsServerAction,
  getBankListsServerAction,
  updateBankAccountServerAction,
} from '../_servers/bank.actions'

// Query Keys
export const BANK_QUERY_KEYS = {
  BANK_ACCOUNTS: ['bank-accounts'],
  BANK_ACCOUNT: (id: number) => ['bank-account', id],
  BANK_LISTS: ['bank-lists'],
} as const

// ==========================
// QUERIES
// ==========================

// Get all bank accounts for a team
export const useBankAccounts = (team_group_id: string) => {
  return useQuery({
    queryKey: [...BANK_QUERY_KEYS.BANK_ACCOUNTS, team_group_id],
    queryFn: () => getBankAccountsServerAction(team_group_id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!team_group_id,
  })
}

// Get bank account by ID
export const useBankAccountById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: BANK_QUERY_KEYS.BANK_ACCOUNT(id),
    queryFn: () => getBankAccountByIdServerAction(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get available banks list
export const useBankLists = () => {
  return useQuery({
    queryKey: BANK_QUERY_KEYS.BANK_LISTS,
    queryFn: getBankListsServerAction,
    staleTime: 30 * 60 * 1000, // 30 minutes (bank lists don't change often)
    gcTime: 60 * 60 * 1000, // 1 hour
  })
}

// ==========================
// MUTATIONS
// ==========================

// Create bank account mutation
export const useCreateBankAccount = (team_group_id: string) => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, IBankAccount>({
    mutationFn: createBankAccountServerAction,
    onSuccess: (data) => {
      // Invalidate และ refetch ทันที
      queryClient.invalidateQueries({
        queryKey: [...BANK_QUERY_KEYS.BANK_ACCOUNTS, team_group_id],
      })

      // Force refetch ทันที
      queryClient.refetchQueries({
        queryKey: [...BANK_QUERY_KEYS.BANK_ACCOUNTS, team_group_id],
      })

      toast.success(data?.message || 'สร้างบัญชีธนาคารเรียบร้อยแล้ว')
    },
    onError: (
      error: Error & {
        response?: {
          data?: {
            message?: string
            statusCode?: number
          }
          status?: number
        }
      },
    ) => {
      const errorMessage = error?.response?.data?.message
      const statusCode = error?.response?.data?.statusCode || error?.response?.status

      if (errorMessage) {
        toast.error(errorMessage)
      } else if (statusCode === 400) {
        toast.error('ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่')
      } else {
        toast.error('ไม่สามารถสร้างบัญชีธนาคารได้ กรุณาลองใหม่อีกครั้ง')
      }
    },
    retry: false, // Disable retry to prevent multiple API calls
  })
}

// Update bank account mutation
export const useUpdateBankAccount = (team_group_id: string) => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, { id: number; data: IBankAccountUpdate }>({
    mutationFn: ({ id, data }: { id: number; data: IBankAccountUpdate }) =>
      updateBankAccountServerAction(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch bank accounts list
      queryClient.invalidateQueries({
        queryKey: [...BANK_QUERY_KEYS.BANK_ACCOUNTS, team_group_id],
      })

      // Invalidate specific bank account
      queryClient.invalidateQueries({
        queryKey: BANK_QUERY_KEYS.BANK_ACCOUNT(variables.id),
      })

      toast.success(data?.message || 'อัปเดตบัญชีธนาคารเรียบร้อยแล้ว')
    },
    onError: (
      error: Error & {
        response?: {
          data?: {
            message?: string
            statusCode?: number
          }
          status?: number
        }
      },
    ) => {
      const errorMessage = error?.response?.data?.message
      const statusCode = error?.response?.data?.statusCode || error?.response?.status

      if (errorMessage) {
        toast.error(errorMessage)
      } else if (statusCode === 404) {
        toast.error('ไม่พบบัญชีธนาคาร กรุณาตรวจสอบและลองใหม่')
      } else if (statusCode === 400) {
        toast.error('ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่')
      } else {
        toast.error('ไม่สามารถอัปเดตบัญชีธนาคารได้ กรุณาลองใหม่อีกครั้ง')
      }
    },
    retry: false, // Disable retry to prevent multiple API calls
  })
}

// Delete bank account mutation
export const useDeleteBankAccount = (team_group_id: string) => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, number>({
    mutationFn: deleteBankAccountServerAction,
    onSuccess: (data) => {
      // Invalidate and refetch bank accounts list
      queryClient.invalidateQueries({
        queryKey: [...BANK_QUERY_KEYS.BANK_ACCOUNTS, team_group_id],
      })

      toast.success(data?.message || 'ลบบัญชีธนาคารเรียบร้อยแล้ว')
    },
    onError: (
      error: Error & {
        response?: {
          data?: {
            message?: string
            statusCode?: number
          }
          status?: number
        }
      },
    ) => {
      const errorMessage = error?.response?.data?.message
      const statusCode = error?.response?.data?.statusCode || error?.response?.status

      if (errorMessage) {
        toast.error(errorMessage)
      } else if (statusCode === 404) {
        toast.error('ไม่พบบัญชีธนาคาร กรุณาตรวจสอบและลองใหม่')
      } else if (statusCode === 403) {
        toast.error('คุณไม่มีสิทธิ์ลบบัญชีธนาคารนี้')
      } else {
        toast.error('ไม่สามารถลบบัญชีธนาคารได้ กรุณาลองใหม่อีกครั้ง')
      }
    },
    retry: false, // Disable retry to prevent multiple API calls
  })
}

// Re-export types for convenience
export type { IBankAccount, IBankAccountUpdate }
