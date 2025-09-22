'use client'

import { CardIcon, WarningIcon } from '@/components/icons'
import SuccessDialog from '@/components/notifications/success-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable, TableColumn } from '@/components/ui/data-table'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioOption } from '@/components/ui/radio-group-v2'
import { Switch } from '@/components/ui/switch'
import { useI18n } from '@/lib/i18n'
import { colors } from '@/lib/utils/colors'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { Download } from 'lucide-react'
import Link from 'next/link'
import { memo, useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react'
import { toast } from 'sonner'
import { TeamHeader } from '../../../_components/team-header'
import { TeamTabMenu } from '../../../_components/team-tab-menu'
import { useConfirmPayout, useInitPayout } from '../_hooks/use-payout'
import { useRevenueBalance } from '../_hooks/use-revenue'
import { BankAccountItem } from '../bank-account/_components/bank-account-item'
import { SelectOTPStep } from './select-otp-step'
import { VerifyOTPStep } from './verify-otp-step'
import { WithdrawStep } from './withdraw-step'

interface RevenuePageProps {
  teamId: string
  locale: string
}

type OTPMethod = 'phone' | 'email'

const tableColumns: TableColumn[] = [
  { key: 'no', header: 'NO', width: '6%' },
  { key: 'transaction', header: 'ยอดเงินขาเข้า', width: '25%' },
  { key: 'amount', header: 'จำนวนเงิน', width: '12%' },
  { key: 'customer', header: 'บัญชีรับเงิน', width: '18%' },
  { key: 'method', header: 'ทำรายการโดย', width: '12%' },
  { key: 'date', header: 'วันที่ทำรายการ', width: '15%' },
  { key: 'status', header: 'สถานะ', width: '8%' },
  { key: 'action', header: 'ACTION', width: '4%' },
]

const transactionData = [
  {
    no: '1',
    transaction: 'ค่าบริการชาร์จแบตเตอรี่ (OneCharge)',
    amount: '3,390,000.00 ฿',
    customer: 'โชวเซกซ์ย้า 339****192**1',
    method: 'ค่าบริการก่อนนี้',
    date: '13/02/2024 11:00:00',
    status: 'สำเร็จ',
  },
  {
    no: '2',
    transaction: 'ค่าบริการชาร์จแบตเตอรี่ (OneCharge)',
    amount: '50,000.00 ฿',
    customer: 'โชวเซกซ์ย้า 338****192**1',
    method: 'ค่าบริการธนาคาร',
    date: '13/02/2024 13:00:00',
    status: 'สำเร็จ',
  },
]

const CalendarIcon = memo(() => (
  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
))
CalendarIcon.displayName = 'CalendarIcon'

const StatusBadge = memo(({ value }: { value: string }) => (
  <span
    className="rounded-full px-3 py-1 text-xs font-medium"
    style={{
      backgroundColor: '#FEF3CD',
      color: '#F59E0B',
    }}
  >
    {value}
  </span>
))
StatusBadge.displayName = 'StatusBadge'

const ActionButton = memo(() => (
  <Button size="sm" variant="ghost" className="h-6 w-6 p-1 text-gray-400 hover:text-gray-600">
    <Download className="h-3 w-3" />
  </Button>
))
ActionButton.displayName = 'ActionButton'

export const RevenuePage = memo(({ teamId, locale }: RevenuePageProps) => {
  const { t } = useI18n()
  const [selectedAccount, setSelectedAccount] = useState('monthly')
  const [autoWithdraw, setAutoWithdraw] = useState(true)

  // Separate dialog states for each step
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [showSelectOTPDialog, setShowSelectOTPDialog] = useState(false)
  const [showVerifyOTPDialog, setShowVerifyOTPDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  // Withdraw dialog states
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [otpMethod, setOtpMethod] = useState<OTPMethod>('phone')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [initResponse, setInitResponse] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  // Hooks
  const { user } = useAuth()
  const {
    data: revenueBalanceResponse,
    isLoading: isRevenueLoading,
    error: revenueError,
    refetch: refetchBalance,
  } = useRevenueBalance(teamId)

  const initPayoutMutation = useInitPayout()
  const confirmPayoutMutation = useConfirmPayout()

  const { transferBalance, lastWithdraw, revenueBankAccount } = useMemo(() => {
    // Get revenue balance data
    const revenueData = revenueBalanceResponse?.data
    const transferBalance = revenueData?.transfer_balance || 0
    const lastWithdraw = revenueData?.last_withdraw

    const revenueBankAccount =
      revenueData?.bank_name && revenueData?.bank_account
        ? {
            id: 1, // Mock ID
            bank_id: 1, // Mock bank ID
            account_name: revenueData.bank_account_name || '',
            account_number: revenueData.bank_account,
            bank_name: revenueData.bank_name,
            bank_logo: '', // Optional
          }
        : null

    return {
      transferBalance,
      lastWithdraw,
      revenueBankAccount,
    }
  }, [revenueBalanceResponse?.data])

  // Withdraw dialog logic
  const currentBalance = revenueBalanceResponse?.data?.transfer_balance || 0
  const maxWithdrawAmount = currentBalance

  const userPhone = user?.phone
  const userEmail = user?.email
  const maskedPhone = userPhone ? userPhone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : null
  const maskedEmail = userEmail ? userEmail.replace(/(.{2}).+(@.+)/, '$1****$2') : null
  const hasPhone = !!userPhone
  const hasEmail = !!userEmail

  // Effects for withdraw dialog
  useEffect(() => {
    if (showWithdrawDialog) {
      refetchBalance()
      if (hasPhone && !hasEmail) {
        setOtpMethod('phone')
      } else if (hasEmail && !hasPhone) {
        setOtpMethod('email')
      } else if (hasPhone) {
        setOtpMethod('phone')
      }
    }
  }, [showWithdrawDialog, refetchBalance, hasPhone, hasEmail])

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (showVerifyOTPDialog && initResponse?.expires_in) {
      setTimeLeft(initResponse.expires_in)

      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [showVerifyOTPDialog, initResponse?.expires_in])

  useEffect(() => {
    if (initPayoutMutation.isSuccess && initPayoutMutation.data) {
      setInitResponse(initPayoutMutation.data.data)
      setShowSelectOTPDialog(false)

      queueMicrotask(() => {
        setShowVerifyOTPDialog(true)
      })
    }
  }, [initPayoutMutation.isSuccess, initPayoutMutation.data])

  useEffect(() => {
    if (confirmPayoutMutation.isSuccess) {
      setShowSuccessDialog(true)
      // Close all withdraw dialogs
      setShowWithdrawDialog(false)
      setShowSelectOTPDialog(false)
      setShowVerifyOTPDialog(false)
      refetchBalance()
    }
  }, [confirmPayoutMutation.isSuccess, refetchBalance])

  // Separate effect for resetting confirm mutation
  useEffect(() => {
    if (confirmPayoutMutation.isSuccess && showSuccessDialog) {
      const timer = setTimeout(() => {
        confirmPayoutMutation.reset()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [confirmPayoutMutation.isSuccess, showSuccessDialog])

  const accountOptions = useMemo<RadioOption[]>(
    () => [
      {
        value: 'monthly',
        label: 'ทุกสิ้นเดือน',
        description: 'ทุกวันที่ 29 ของเดือน',
        disabled: false,
      },
      {
        value: 'specific-date',
        label: 'ทุกวันที่ ระบุวันที่',
        description: 'ตั้งค่าวันที่เอง',
        disabled: true,
        icon: <CalendarIcon />,
      },
    ],
    [],
  )

  const enhancedColumns = useMemo(
    () =>
      tableColumns.map((col) => {
        if (col.key === 'status') {
          return {
            ...col,
            render: (value: string) => <StatusBadge value={value} />,
          }
        }
        if (col.key === 'action') {
          return {
            ...col,
            render: () => <ActionButton />,
          }
        }
        return col
      }),
    [],
  )

  const handleAccountChange = useCallback((value: string) => {
    setSelectedAccount(value)
  }, [])

  const handleAutoWithdrawChange = useCallback((checked: boolean) => {
    setAutoWithdraw(checked)
  }, [])

  const handleWithdrawClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowWithdrawDialog(true)
  }, [])

  // Withdraw dialog handlers
  const handleWithdrawReset = useCallback(() => {
    setWithdrawAmount('')
    setOtp(['', '', '', '', '', ''])
    setInitResponse(null)
    setTimeLeft(0)
    setShowSuccessDialog(false)
    if (hasPhone) {
      setOtpMethod('phone')
    } else if (hasEmail) {
      setOtpMethod('email')
    }
  }, [hasPhone, hasEmail])

  const handleWithdrawClose = useCallback(() => {
    handleWithdrawReset()
    setShowWithdrawDialog(false)
    setShowSelectOTPDialog(false)
    setShowVerifyOTPDialog(false)
  }, [handleWithdrawReset])

  const handleSuccessDialogClose = useCallback(() => {
    setShowSuccessDialog(false)
    handleWithdrawClose() // Close all dialogs
  }, [handleWithdrawClose])

  const handleWithdrawAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setWithdrawAmount(value)
    }
  }, [])

  const validateAmount = useCallback(() => {
    const numAmount = parseFloat(withdrawAmount)
    if (!withdrawAmount || numAmount <= 0) {
      toast.error('กรุณาระบุจำนวนเงินที่ต้องการถอน')
      return false
    }
    if (numAmount < 30) {
      toast.error('จำนวนเงินขั้นต่ำในการถอนคือ 30 บาท')
      return false
    }
    if (numAmount > maxWithdrawAmount) {
      toast.error(`จำนวนเงินที่ถอนได้สูงสุด ${maxWithdrawAmount.toLocaleString()} บาท`)
      return false
    }
    return true
  }, [withdrawAmount, maxWithdrawAmount])

  const handleNextToOTP = useCallback(() => {
    if (!validateAmount()) return

    if (!hasPhone && !hasEmail) {
      toast.error('กรุณาเพิ่มเบอร์โทรศัพท์หรืออีเมลในโปรไฟล์ก่อนถอนเงิน')
      return
    }

    // Close withdraw dialog and open select OTP dialog
    setShowWithdrawDialog(false)
    setShowSelectOTPDialog(true)
  }, [validateAmount, hasPhone, hasEmail])

  const handleSelectOTPMethod = useCallback(() => {
    if (!validateAmount()) return

    setShowSelectOTPDialog(false)

    initPayoutMutation.mutate({
      team_group_id: parseInt(teamId, 10),
      amount: parseFloat(withdrawAmount),
      otp_type: otpMethod,
    })
  }, [validateAmount, withdrawAmount, otpMethod, teamId, initPayoutMutation])

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) return

      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      if (value && index < 5) {
        const nextInput = document.querySelector(
          `input[name="otp-${index + 1}"]`,
        ) as HTMLInputElement
        nextInput?.focus()
      }
    },
    [otp],
  )

  const handleSubmitOTP = useCallback(async () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      toast.error('กรุณากรอกรหัส OTP ให้ครบ 6 หลัก')
      return
    }

    if (timeLeft <= 0) {
      toast.error('รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่')
      return
    }

    if (!initResponse?.payout_transaction_id) {
      toast.error('ไม่พบรหัสธุรกรรม กรุณาเริ่มต้นใหม่')
      return
    }

    confirmPayoutMutation.mutate({
      payout_transaction_id: initResponse.payout_transaction_id,
      otp_ref: initResponse.otp_ref,
      otp_code: otpString,
    })
  }, [otp, initResponse, confirmPayoutMutation, timeLeft])

  const handleWithdrawBack = useCallback(() => {
    if (showVerifyOTPDialog) {
      // Go back from verify OTP to select OTP
      setShowVerifyOTPDialog(false)
      setShowSelectOTPDialog(true)
    } else if (showSelectOTPDialog) {
      // Go back from select OTP to withdraw
      setShowSelectOTPDialog(false)
      setShowWithdrawDialog(true)
    }
  }, [showVerifyOTPDialog, showSelectOTPDialog])

  // Handler for canceling withdraw
  const handleWithdrawCancel = useCallback(() => {
    handleWithdrawClose()
  }, [handleWithdrawClose])

  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
    })
      .format(amount)
      .replace('฿', '฿ ')
  }, [])

  // Format date
  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return 'ไม่มีข้อมูล'

    const date = new Date(dateString)
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }, [])

  const withdrawButtonStyle = useMemo(
    () => ({
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    }),
    [],
  )

  const withdrawButtonHoverHandlers = useMemo(
    () => ({
      onMouseEnter: (e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.backgroundColor = colors.primary[600]
      },
      onMouseLeave: (e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.backgroundColor = colors.primary[500]
      },
    }),
    [],
  )

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <TeamHeader teamId={teamId} pageTitle={t('team_tabs.revenue')} />

      {/* Common Team Tab Menu */}
      <TeamTabMenu active="revenue" locale={locale} teamId={teamId} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - กระเป๋าเงินบริษัท */}
        <div className="flex h-full flex-col lg:col-span-1">
          <div className="relative flex flex-1 flex-col rounded-lg bg-white p-4 shadow-sm sm:p-6">
            <h3 className="mb-6 text-base font-medium text-gray-800">กระเป๋าเงินบริษัท</h3>

            {/* Balance Card */}
            <div
              className="relative z-10 mb-4 overflow-hidden rounded-xl p-6 pb-10 text-white"
              style={{
                background: 'linear-gradient(135deg, #98AEFF 0%, #98AEFF 100%)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-90px',
                  left: '-130px',
                  width: '540px',
                  height: '540px',
                  background: 'radial-gradient(circle at 50% 50%, #A9BCFF 70%, transparent 100%)',
                  borderRadius: '50%',
                  zIndex: 1,
                  opacity: 0.7,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '-60px',
                  left: '-100px',
                  width: '420px',
                  height: '420px',
                  background: 'radial-gradient(circle at 50% 50%, #6484F5 70%, transparent 100%)',
                  borderRadius: '50%',
                  zIndex: 2,
                  opacity: 0.7,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '-30px',
                  left: '-70px',
                  width: '300px',
                  height: '300px',
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
                <div className="text-3xl font-bold">
                  {isRevenueLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-32 animate-pulse rounded bg-white/20"></div>
                    </div>
                  ) : revenueError ? (
                    <span className="text-lg">ข้อมูลไม่สามารถโหลดได้</span>
                  ) : (
                    formatCurrency(transferBalance)
                  )}
                </div>
              </div>
            </div>

            {/* Transfer Section */}
            <div className="z-20 -mt-8 rounded-lg bg-gray-50 px-4 py-6">
              <div className="flex items-center justify-end space-x-3">
                <div className="h-10 w-0.5 rounded-sm bg-[#D0DAFF]"></div>
                <div className="text-right">
                  <div className="mb-2 flex items-center justify-end space-x-2">
                    <svg
                      className="h-4 w-4 text-[#355FF5]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-light text-[#355FF5]">ถอนครั้งล่าสุด</span>
                  </div>
                  <div className="text-xs font-light text-gray-500">
                    {isRevenueLoading ? (
                      <div className="ml-auto h-4 w-48 animate-pulse rounded bg-gray-200"></div>
                    ) : (
                      formatDate(lastWithdraw || null)
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - การถอนเงิน */}
        <div className="flex h-full flex-col lg:col-span-1">
          <div className="flex flex-1 flex-col rounded-lg bg-white p-4 shadow-sm sm:p-6">
            <h3 className="mb-6 text-base font-medium" style={{ color: colors.neutral[800] }}>
              การถอนเงิน :
            </h3>

            {/* Auto Withdraw Toggle and Radio Options */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Auto Withdraw Toggle */}
                <div className="flex items-start space-x-3 border-b border-gray-200 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
                  <Switch
                    checked={autoWithdraw}
                    onCheckedChange={handleAutoWithdrawChange}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                  />
                  <span className="text-sm font-medium" style={{ color: colors.neutral[800] }}>
                    ถอนอัตโนมัติ
                  </span>
                </div>

                {/* Radio Options */}
                <div className="">
                  <RadioGroup
                    name="account"
                    value={selectedAccount}
                    onValueChange={handleAccountChange}
                    options={accountOptions}
                    className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
                  />
                </div>
              </div>
            </div>

            {/* Warning Message using CustomAlert */}
            <div className="mb-6 text-sm">
              <div className="rounded-lg bg-[#FFE8D7] p-3">
                <div className="flex items-start gap-3">
                  <WarningIcon />
                  <div className="text-sm font-medium text-[#F67416]">
                    คุณสามารถถอนเงินได้ฟรี 1 ครั้งต่อเดือน {''}
                    <span className="font-light">ขยับแพ็คเก็จของคุณเพื่อประโยชน์เพิ่มขึ้น</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-right">
              <Button
                className="rounded-lg px-8 py-3 text-base font-medium text-white"
                style={withdrawButtonStyle}
                onClick={handleWithdrawClick}
                {...withdrawButtonHoverHandlers}
              >
                ถอนเงิน
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - ปัญชีแข้า */}
        <div className="flex h-full flex-col lg:col-span-1">
          <div className="flex flex-1 flex-col rounded-lg bg-white p-4 shadow-sm sm:p-6">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">บัญชีธนาคาร</h3>
              <Link href={`/${locale}/team/${teamId}/revenue/bank-account/manage`}>
                <Button
                  size="lg"
                  className="w-fit rounded-xl border-none bg-blue-600 px-8 py-2 text-base font-medium text-white hover:bg-blue-700"
                  style={{ backgroundColor: '#2563EB', color: '#fff' }}
                >
                  ตั้งค่า
                </Button>
              </Link>
            </div>
            <hr className="mb-6 border-t border-blue-100" />

            {/* Main Card */}
            {isRevenueLoading ? (
              <div className="flex items-center justify-center rounded-2xl bg-[#EEF4FF] p-6">
                <div className="text-[#355FF5]">กำลังโหลดข้อมูลบัญชี...</div>
              </div>
            ) : revenueError ? (
              <div className="flex items-center justify-center rounded-2xl bg-red-50 p-6">
                <div className="text-red-600">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
              </div>
            ) : revenueBankAccount ? (
              <BankAccountItem account={revenueBankAccount} size="small" />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-6">
                <div className="mb-4 text-gray-500">ยังไม่มีบัญชีธนาคาร</div>
              </div>
            )}
          </div>
        </div>

        {/* Revenue Statistics Card */}
        <div className="lg:col-span-3">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {/* Total Balance */}
                <div className="py-4 text-center sm:py-0">
                  <div className="text-2xl font-semibold text-[#364A63]">
                    {isRevenueLoading ? (
                      <div className="mx-auto h-8 w-40 animate-pulse rounded bg-gray-200"></div>
                    ) : revenueError ? (
                      <span className="text-lg text-red-500">Error</span>
                    ) : (
                      formatCurrency(revenueBalanceResponse?.data?.available_balance || 0)
                    )}
                  </div>
                  <div className="mt-2 text-sm font-light text-[#364A63]">Total Balance</div>
                </div>

                {/* On Hold */}
                <div className="py-4 text-center sm:py-0">
                  <div className="text-2xl font-semibold text-[#364A63]">
                    {isRevenueLoading ? (
                      <div className="mx-auto h-8 w-40 animate-pulse rounded bg-gray-200"></div>
                    ) : revenueError ? (
                      <span className="text-lg text-red-500">Error</span>
                    ) : (
                      formatCurrency(Math.abs(revenueBalanceResponse?.data?.onhold_balance || 0))
                    )}
                  </div>
                  <div className="mt-2 text-sm font-light text-[#364A63]">On Hold</div>
                </div>

                {/* Reserve */}
                <div className="py-4 text-center sm:py-0">
                  <div className="text-2xl font-semibold text-[#364A63]">
                    {isRevenueLoading ? (
                      <div className="mx-auto h-8 w-40 animate-pulse rounded bg-gray-200"></div>
                    ) : revenueError ? (
                      <span className="text-lg text-red-500">Error</span>
                    ) : (
                      formatCurrency(revenueBalanceResponse?.data?.reserve_balance || 0)
                    )}
                  </div>
                  <div className="mt-2 text-sm font-light text-[#364A63]">Reserve</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* อยู่ตรงนี้ */}

        {/* Full Width Table Section */}
        <div className="lg:col-span-3">
          <Card className="bg-white">
            <div className="border-b px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <h3 className="text-lg font-medium">รายการของฉัน</h3>
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                  <div className="flex">
                    <button className="rounded-l-md bg-black px-3 py-2 text-sm text-white sm:px-4">
                      ยอดเงินขาเข้า
                    </button>
                    <button className="rounded-r-md border-l bg-gray-100 px-3 py-2 text-sm text-gray-600 sm:px-4">
                      ยอดเงินขาออก
                    </button>
                  </div>
                  <Button
                    size="sm"
                    className="flex items-center space-x-2 bg-black text-white hover:bg-gray-800"
                  >
                    <Download className="h-4 w-4" />
                    <span>EXPORT</span>
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Filters */}
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="ค้นหา"
                    className="w-48 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
                  />
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">กรองตาม :</span>
                  <select className="w-32 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm">
                    <option value="">ทั้งหมด</option>
                    <option value="success">สำเร็จ</option>
                    <option value="pending">รอดำเนินการ</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <DataTable columns={enhancedColumns} data={transactionData} />

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                <span>Showing 1 to 10 of 130 Results</span>
                <div className="flex items-center space-x-1">
                  <span>10 List</span>
                  <div className="ml-4 flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((page) => (
                      <button
                        key={page}
                        className={`h-8 w-8 rounded ${
                          page === 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <span>...</span>
                    <button className="h-8 w-8 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">
                      10
                    </button>
                    <button className="h-8 w-8 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">
                      →
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Withdraw Dialog */}
      <Dialog
        open={showWithdrawDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowWithdrawDialog(false)
          }
        }}
      >
        <DialogContent className="max-w-md p-0">
          <DialogTitle className="sr-only">ถอนเงิน</DialogTitle>
          <WithdrawStep
            amount={withdrawAmount}
            currentBalance={currentBalance}
            isBalanceLoading={isRevenueLoading}
            onAmountChange={handleWithdrawAmountChange}
            onNext={handleNextToOTP}
            onCancel={handleWithdrawCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Select OTP Dialog */}
      <Dialog
        open={showSelectOTPDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowSelectOTPDialog(false)
          }
        }}
      >
        <DialogContent className="max-w-md p-0">
          <DialogTitle className="sr-only">เลือกวิธีรับ OTP</DialogTitle>
          <SelectOTPStep
            otpMethod={otpMethod}
            hasPhone={hasPhone}
            hasEmail={hasEmail}
            maskedPhone={maskedPhone}
            maskedEmail={maskedEmail}
            isLoading={initPayoutMutation.isPending}
            onOtpMethodChange={setOtpMethod}
            onSendOTP={handleSelectOTPMethod}
            onBack={handleWithdrawBack}
          />
        </DialogContent>
      </Dialog>

      {/* Verify OTP Dialog */}
      <Dialog
        open={showVerifyOTPDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowVerifyOTPDialog(false)
          }
        }}
      >
        <DialogContent className="max-w-md p-0">
          <DialogTitle className="sr-only">ยืนยัน OTP</DialogTitle>
          <VerifyOTPStep
            otp={otp}
            otpMethod={otpMethod}
            maskedPhone={maskedPhone}
            maskedEmail={maskedEmail}
            timeLeft={timeLeft}
            otpRef={initResponse?.otp_ref || null}
            isLoading={confirmPayoutMutation.isPending}
            onOtpChange={handleOtpChange}
            onSubmit={handleSubmitOTP}
            onBack={handleWithdrawBack}
          />
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={handleSuccessDialogClose}
        title="ถอนเงินสำเร็จ"
        message={`จำนวนเงิน ${parseFloat(withdrawAmount || '0').toLocaleString()} บาท`}
        buttonText="เสร็จสิ้น"
        onButtonClick={handleSuccessDialogClose}
      />
    </div>
  )
})

RevenuePage.displayName = 'RevenuePage'
