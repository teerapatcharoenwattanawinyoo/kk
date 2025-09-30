'use client'

import { WarningIcon } from '@/components/icons'
import { CardIcon } from '@/components/icons/CardIcon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { memo } from 'react'

interface WithdrawStepProps {
  amount: string
  currentBalance: number
  isBalanceLoading: boolean
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onNext: () => void
  onCancel: () => void
}

export const WithdrawStep = memo(
  ({
    amount,
    currentBalance,
    isBalanceLoading,
    onAmountChange,
    onNext,
    onCancel,
  }: WithdrawStepProps) => {
    return (
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">คุณต้องการถอนเงินใช่หรือไม่</h2>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Balance Card */}
          <div
            className="relative overflow-hidden rounded-xl p-6 text-white"
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background circles - same as revenue tab */}
            <div
              style={{
                position: 'absolute',
                top: '-60px',
                left: '-80px',
                width: '260px',
                height: '260px',
                background: 'radial-gradient(circle at 50% 50%, #98AEFF 70%, transparent 100%)',
                borderRadius: '50%',
                zIndex: 1,
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '-45px',
                left: '-65px',
                width: '220px',
                height: '220px',
                background: 'radial-gradient(circle at 50% 50%, #A9BCFF 70%, transparent 100%)',
                borderRadius: '50%',
                zIndex: 2,
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '-30px',
                left: '-50px',
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle at 50% 50%, #6484F5 70%, transparent 100%)',
                borderRadius: '50%',
                zIndex: 3,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '-15px',
                left: '-35px',
                width: '140px',
                height: '140px',
                background: 'radial-gradient(circle at 50% 50%, #355FF5 70%, transparent 100%)',
                borderRadius: '50%',
                zIndex: 4,
                opacity: 0.4,
              }}
            />
            <div className="relative z-10 text-left">
              <div className="mb-2 flex items-center justify-start space-x-2">
                <CardIcon className="h-5 w-5" />
                <span className="text-sm font-medium">ยอดที่ถอนได้</span>
              </div>
              <div className="text-2xl font-bold">
                {isBalanceLoading ? (
                  <div className="mx-auto h-8 w-32 animate-pulse rounded bg-white/20"></div>
                ) : (
                  `${currentBalance.toLocaleString()} ฿`
                )}
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">ระบุตัวเลข</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Amount"
                value={amount}
                onChange={onAmountChange}
                className="pr-8"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400">
                ฿
              </div>
            </div>
          </div>

          {/* Warning Alert */}
          <div className="rounded-lg border border-[#F67416]/20 bg-[#FFE8D7] p-4">
            <div className="flex items-start space-x-3">
              <WarningIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#F67416]" />
              <div className="text-sm text-[#F67416]">
                <span className="font-semibold">คุณสามารถถอนเงินได้ฟรี 1 ครั้งต่อเดือน</span>{' '}
                ขยับแพ็คเก็จของคุณเพื่อประโยชน์เพิ่มขึ้น
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 border-t border-gray-200 p-6">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
          >
            Cancel
          </Button>
          <Button
            onClick={onNext}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            disabled={!amount}
          >
            Next
          </Button>
        </div>
      </div>
    )
  },
)

WithdrawStep.displayName = 'WithdrawStep'
