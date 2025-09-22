'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useBankAccounts, useDeleteBankAccount } from '../_hooks/use-bank'
import { BankAccountCard } from './bank-account-card'
import { BankAccount } from './bank-account-item'

interface BankAccountManagePageProps {
  teamId: string
  locale: string
}

export const BankAccountManagePage = ({ teamId, locale }: BankAccountManagePageProps) => {
  const router = useRouter()
  const { data: bankAccountsResponse, isLoading, error } = useBankAccounts(teamId)
  const deleteBankAccountMutation = useDeleteBankAccount()
  const [selectedAccounts, setSelectedAccounts] = useState<Set<number>>(new Set())

  const bankAccounts = bankAccountsResponse?.data || []

  const handleBack = useCallback(() => {
    router.push(`/${locale}/team/${teamId}/revenue`)
  }, [router, locale, teamId])

  const handleAddAccount = useCallback(() => {
    router.push(`/${locale}/team/${teamId}/revenue/bank-account/add`)
  }, [router, locale, teamId])

  const handleToggleAccount = useCallback((accountId: number, isEnabled: boolean) => {
    if (isEnabled) {
      setSelectedAccounts((prev) => new Set([...prev, accountId]))
    } else {
      setSelectedAccounts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(accountId)
        return newSet
      })
    }
  }, [])

  const handleEditAccount = useCallback(
    (accountId: number) => {
      router.push(`/${locale}/team/${teamId}/revenue/bank-account/edit/${accountId}`)
    },
    [router, locale, teamId],
  )

  const handleDeleteAccount = useCallback(
    (accountId: number) => {
      deleteBankAccountMutation.mutate(accountId, {
        onSuccess: () => {
          // Remove from selected accounts if it was selected
          setSelectedAccounts((prev) => {
            const newSet = new Set(prev)
            newSet.delete(accountId)
            return newSet
          })
        },
        onError: (error) => {
          console.error('Failed to delete bank account:', error)
        },
      })
    },
    [deleteBankAccountMutation],
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Manage Bank Account</h1>
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Manage Bank Account</h1>
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center text-red-600">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Manage Bank Account</h1>
          </div>
          <Button onClick={handleAddAccount} className="bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            ADD
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mx-auto">
          {bankAccounts.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="mb-4 text-gray-500">ยังไม่มีบัญชีธนาคาร</div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bankAccounts.map((account: BankAccount) => (
                <BankAccountCard
                  key={account.id}
                  account={account}
                  isSelected={selectedAccounts.has(account.id)}
                  onToggle={handleToggleAccount}
                  onEdit={handleEditAccount}
                  onDelete={handleDeleteAccount}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
