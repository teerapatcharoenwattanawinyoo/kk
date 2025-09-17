import { toast } from '@/hooks/use-toast'
import {
  createBankAccount,
  deleteBankAccount,
  getBankAccountById,
  getBankAccounts,
  getBankLists,
  updateBankAccount,
  type IBankAccount,
  type IBankAccountUpdate,
} from '@/lib/api/team-group/bank'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Query Keys
export const BANK_QUERY_KEYS = {
  BANK_ACCOUNTS: ['bank-accounts'],
  BANK_ACCOUNT: (id: number) => ['bank-account', id],
  BANK_LISTS: ['bank-lists'],
} as const

// ==========================
// QUERIES
// ==========================

// Get all bank accounts
export const useBankAccounts = () => {
  return useQuery({
    queryKey: BANK_QUERY_KEYS.BANK_ACCOUNTS,
    queryFn: getBankAccounts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get bank account by ID
export const useBankAccountById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: BANK_QUERY_KEYS.BANK_ACCOUNT(id),
    queryFn: () => getBankAccountById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get available banks list
export const useBankLists = () => {
  return useQuery({
    queryKey: BANK_QUERY_KEYS.BANK_LISTS,
    queryFn: getBankLists,
    staleTime: 30 * 60 * 1000, // 30 minutes (bank lists don't change often)
    gcTime: 60 * 60 * 1000, // 1 hour
  })
}

// ==========================
// MUTATIONS
// ==========================

// Create bank account mutation
export const useCreateBankAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBankAccount,
    onSuccess: (data) => {
      // Invalidate และ refetch ทันที
      queryClient.invalidateQueries({
        queryKey: BANK_QUERY_KEYS.BANK_ACCOUNTS,
      })

      // Force refetch ทันที
      queryClient.refetchQueries({
        queryKey: BANK_QUERY_KEYS.BANK_ACCOUNTS,
      })

      toast({
        title: 'สำเร็จ',
        description: data.message || 'สร้างบัญชีธนาคารเรียบร้อยแล้ว',
      })
    },
    onError: (
      error: Error & {
        response?: {
          data?: {
            message?: string
          }
        }
      },
    ) => {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error?.response?.data?.message || 'ไม่สามารถสร้างบัญชีธนาคารได้',
        variant: 'destructive',
      })
    },
  })
}

// Update bank account mutation
export const useUpdateBankAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IBankAccountUpdate }) =>
      updateBankAccount(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch bank accounts list
      queryClient.invalidateQueries({
        queryKey: BANK_QUERY_KEYS.BANK_ACCOUNTS,
      })

      // Invalidate specific bank account
      queryClient.invalidateQueries({
        queryKey: BANK_QUERY_KEYS.BANK_ACCOUNT(variables.id),
      })

      toast({
        title: 'สำเร็จ',
        description: data.message || 'อัปเดตบัญชีธนาคารเรียบร้อยแล้ว',
      })
    },
    onError: (
      error: Error & {
        response?: {
          data?: {
            message?: string
          }
        }
      },
    ) => {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error?.response?.data?.message || 'ไม่สามารถอัปเดตบัญชีธนาคารได้',
        variant: 'destructive',
      })
    },
  })
}

// Delete bank account mutation
export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBankAccount,
    onSuccess: (data) => {
      // Invalidate and refetch bank accounts list
      queryClient.invalidateQueries({
        queryKey: BANK_QUERY_KEYS.BANK_ACCOUNTS,
      })

      toast({
        title: 'สำเร็จ',
        description: data.message || 'ลบบัญชีธนาคารเรียบร้อยแล้ว',
      })
    },
    onError: (
      error: Error & {
        response?: {
          data?: {
            message?: string
          }
        }
      },
    ) => {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error?.response?.data?.message || 'ไม่สามารถลบบัญชีธนาคารได้',
        variant: 'destructive',
      })
    },
  })
}

// Re-export types for convenience
export type { IBankAccount, IBankAccountUpdate }
