'use client'

import { useAuth } from '@/app/[locale]/(auth)/_hooks/use-auth-query'
import { DateTimePicker } from '@/components/datetime-picker'
import FetchLoader from '@/components/FetchLoader'
import { CardIcon, WarningIcon } from '@/components/icons'
import SuccessDialog from '@/components/notifications/success-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable, TableColumn } from '@/components/ui/data-table'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioOption } from '@/components/ui/radio-group-v2'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useI18n } from '@/lib/i18n'
import { colors } from '@/lib/utils/colors'
import { Download } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { memo, useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react'
import { toast } from 'sonner'
import { TeamHeader } from '../../../_components/team-header'
import { TeamTabMenu } from '../../../_components/team-tab-menu'
import { useTransactionList } from '../../overview/_hooks/use-transaction'
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
  const router = useRouter()
  const params = useParams()

  const [selectedAccount, setSelectedAccount] = useState('monthly')
  const [autoWithdraw, setAutoWithdraw] = useState(true)

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState('00:00')

  // Table states
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

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

  // Transaction data hooks
  const {
    data: transactionData,
    isLoading: isLoadingTransactions,
    error: transactionError,
  } = useTransactionList({
    teamId,
    page: currentPage,
    pageSize: 10,
    search: searchQuery,
  })

  const tableData = (transactionData?.data?.data || []) as unknown as Record<string, unknown>[]

  const handleRowClick = (row: Record<string, unknown>) => {
    const transactionId = String(row.id || row.order_number)
    router.push(`/${params.locale}/team/${teamId}/revenue/transaction/${transactionId}`)
  }

  // Table columns configuration
  const tableColumns: TableColumn<Record<string, unknown>>[] = [
    {
      key: 'order_number',
      header: t('table.order_number'),
      width: '15%',
      render: (value: string) => <span style={{ color: '#6E82A5' }}>{value}</span>,
    },
    {
      key: 'charging_station',
      header: t('table.charging_station'),
      width: '15%',
    },
    { key: 'charger_id', header: t('table.charger'), width: '10%' },
    {
      key: 'rate',
      header: t('table.rate'),
      width: '8%',
      render: (value: string) => `฿${value ?? '-'}/kWh`,
    },
    {
      key: 'start_charge_date',
      header: t('table.start_charge'),
      width: '12%',
      render: (value: string, row: Record<string, unknown>) => (
        <div className="text-center">
          <div>{value}</div>
          <div style={{ color: '#6E82A5' }}>{String(row.start_charge_time || '')}</div>
        </div>
      ),
    },
    {
      key: 'stop_charge_date',
      header: t('table.stop_charge'),
      width: '12%',
      render: (value: string, row: Record<string, unknown>) => (
        <div className="text-center">
          <div>{value}</div>
          <div style={{ color: '#6E82A5' }}>{String(row.stop_charge_time || '')}</div>
        </div>
      ),
    },
    {
      key: 'time',
      header: t('table.time'),
      width: '8%',
      render: (value: string) => {
        if (!value) return '-'
        if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value
        const num = Number(value)
        if (!isNaN(num)) {
          const h = Math.floor(num / 60)
          const m = Math.floor(num % 60)
          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`
        }
        return value
      },
    },
    {
      key: 'kwh',
      header: t('table.kwh'),
      width: '8%',
      render: (value: string) => {
        const num = Number(value)
        return isNaN(num) ? '-' : `${num.toFixed(2)} kWh`
      },
    },
    {
      key: 'price',
      header: t('table.cost'),
      width: '8%',
      render: (value: string) => {
        // Format as currency (Baht)
        const num = Number(value)
        return isNaN(num)
          ? value
          : `฿${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      },
    },
    { key: 'payment_method', header: t('table.payment'), width: '10%' },
    {
      key: 'status',
      header: t('table.status'),
      width: '10%',
      render: (value: string) => {
        let bg = '#DFF8F3',
          color = '#0D8A72',
          text = value
        if (value === 'pending') {
          bg = '#FEF3C7'
          color = '#92400E'
          text = t('status.pending')
        } else if (value === 'failed' || value === 'cancelled') {
          bg = '#FEE2E2'
          color = '#DC2626'
          text = t('status.failed')
        } else if (value === 'processing') {
          bg = '#DBEAFE'
          color = '#1D4ED8'
          text = t('status.processing')
        } else if (!value || value === 'completed') {
          bg = '#DFF8F3'
          color = '#0D8A72'
          text = t('status.completed')
        }
        return (
          <span
            className="rounded-full px-2 py-1 text-xs font-medium"
            style={{ backgroundColor: bg, color }}
          >
            {text}
          </span>
        )
      },
    },
    {
      key: 'action',
      header: t('table.action'),
      width: '10%',
      render: (value: string, row: Record<string, unknown>) => (
        <button
          className="text-gray-400 hover:text-gray-600"
          onClick={() => {
            const transactionId = String(row.id || row.order_number)
            router.push(`/${params.locale}/team/${teamId}/revenue/transaction/${transactionId}`)
          }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      ),
    },
  ]

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

  const handleAccountChange = useCallback((value: string) => {
    setSelectedAccount(value)
  }, [])

  const handleAutoWithdrawChange = useCallback((checked: boolean) => {
    setAutoWithdraw(checked)

    if (checked) {
      setSelectedAccount('monthly')
      setSelectedDate(undefined)
      setSelectedTime('00:00')
    }
  }, [])

  // Handler สำหรับ date picker
  const handleDateChange = useCallback((date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setSelectedAccount('specific-date')
      setAutoWithdraw(false)
    }
  }, [])

  const handleTimeChange = useCallback((time: string) => {
    setSelectedTime(time)
  }, [])

  const handleDatePickerOpenChange = useCallback((open: boolean) => {
    setShowDatePicker(open)
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

  // Account options for radio group
  const accountOptions = useMemo<RadioOption[]>(
    () => [
      {
        value: 'monthly',
        label: 'ทุกสิ้นเดือน',
        description: 'ทุกวันที่ 1 ของเดือน',
        disabled: false,
      },
      {
        value: 'specific-date',
        label: selectedDate
          ? `ทุกวันที่ : ${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
          : 'ทุกวันที่ : ระบุวันที่',
        description: (
          <div className="mt-1">
            <DateTimePicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
              isOpen={showDatePicker}
              onOpenChange={handleDatePickerOpenChange}
              isEnabled={true}
            />
          </div>
        ),
        disabled: false,
        icon: <CalendarIcon />,
      },
    ],
    [
      selectedDate,
      selectedTime,
      showDatePicker,
      handleDateChange,
      handleTimeChange,
      handleDatePickerOpenChange,
    ],
  )

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
              {/* Auto Withdraw Toggle */}
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
              <div className="mb-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {t('overview.search_by_id')}
                  </span>
                  <Input
                    type="text"
                    placeholder=""
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {t('overview.filter_by_status')}
                  </span>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder={t('overview.all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('overview.all')}</SelectItem>
                      <SelectItem value="completed">{t('status.completed')}</SelectItem>
                      <SelectItem value="pending">{t('status.pending')}</SelectItem>
                      <SelectItem value="failed">{t('buttons.cancel')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{t('overview.date_by')}</span>
                  <Select defaultValue="all_dates">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder={t('overview.all_dates')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_dates">{t('overview.all_dates')}</SelectItem>
                      <SelectItem value="today">{t('overview.today')}</SelectItem>
                      <SelectItem value="week">{t('overview.this_week')}</SelectItem>
                      <SelectItem value="month">{t('overview.this_month')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Table */}
              {isLoadingTransactions ? (
                <FetchLoader />
              ) : transactionError ? (
                <div className="flex items-center justify-center py-8 text-red-500">
                  <p>Error loading transaction data</p>
                </div>
              ) : (
                <DataTable columns={tableColumns} data={tableData} onRowClick={handleRowClick} />
              )}

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {transactionData?.data
                    ? `Showing ${(transactionData.data.page_current - 1) * transactionData.data.page_size + 1}-${Math.min(transactionData.data.page_current * transactionData.data.page_size, transactionData.data.item_total)} of ${transactionData.data.item_total} results`
                    : t('overview.showing_results')}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!transactionData?.data || currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  {transactionData?.data &&
                    [...Array(Math.min(5, transactionData.data.page_total))].map((_, index) => {
                      const page = index + 1
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    })}
                  {transactionData?.data && transactionData.data.page_total > 5 && (
                    <>
                      <span>...</span>
                      <Button
                        variant={
                          currentPage === transactionData.data.page_total ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => setCurrentPage(transactionData.data.page_total)}
                      >
                        {transactionData.data.page_total}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      !transactionData?.data || currentPage === transactionData.data.page_total
                    }
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
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
