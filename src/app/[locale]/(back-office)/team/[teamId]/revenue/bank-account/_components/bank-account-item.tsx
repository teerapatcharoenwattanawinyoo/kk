'use client'

import { BankLogoSCB } from '@/components/icons/BankLogoSCB'
import Image from 'next/image'
import { memo } from 'react'

export interface BankAccount {
  id: number
  bank_id?: number
  bank_name?: string
  bank_logo?: string
  account_number: string
  account_name: string
  status?: string
  is_primary?: boolean
}

export interface BankAccountItemProps {
  account: BankAccount
  size?: 'large' | 'small'
}

// Memoized Bank Account Item Component
export const BankAccountItem = memo(
  ({ account, size = 'large' }: BankAccountItemProps) => {
    const isLarge = size === 'large'
    return (
      <div
        className={`flex items-center justify-between rounded-2xl p-6 ${isLarge ? 'bg-[#EEF4FF]' : 'rounded-lg bg-gray-50 p-3'}`}
      >
        <div className="flex items-center">
          <div
            className={`mr-4 flex items-center justify-center rounded-full ${isLarge ? 'h-16 w-16' : 'mr-3 h-10 w-10'}`}
          >
            {account.bank_logo ? (
              <Image
                src={account.bank_logo}
                alt={account.bank_name || 'Bank logo'}
                width={isLarge ? 48 : 32}
                height={isLarge ? 48 : 32}
                className="object-contain"
              />
            ) : (
              <BankLogoSCB size={isLarge ? 43 : 24} />
            )}
          </div>
          <div>
            <div
              className={`font-bold text-blue-600 ${isLarge ? 'mb-1 text-lg' : 'text-sm'}`}
            >
              {account.bank_name} {account.account_number}
            </div>
            <div
              className={`font-medium text-blue-600 ${isLarge ? 'text-base' : 'text-xs text-gray-500'}`}
            >
              {account.account_name}
            </div>
          </div>
        </div>
      </div>
    )
  },
)

BankAccountItem.displayName = 'BankAccountItem'
