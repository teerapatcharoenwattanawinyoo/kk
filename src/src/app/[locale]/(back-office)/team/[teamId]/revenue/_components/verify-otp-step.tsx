'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { memo, useCallback } from 'react'

interface VerifyOTPStepProps {
  otp: string[]
  otpMethod: 'phone' | 'email'
  maskedPhone: string | null
  maskedEmail: string | null
  timeLeft: number
  otpRef: string | null
  isLoading: boolean
  onOtpChange: (index: number, value: string) => void
  onSubmit: () => void
  onBack: () => void
}

export const VerifyOTPStep = memo(({
  otp,
  otpMethod,
  maskedPhone,
  maskedEmail,
  timeLeft,
  otpRef,
  isLoading,
  onOtpChange,
  onSubmit,
  onBack,
}: VerifyOTPStepProps) => {
  // Format time for display (mm:ss)
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-6">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          ยืนยันการถอนเงิน
        </h2>
        <div className="w-6" />
      </div>

      {/* Content */}
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            Verify OTP
          </h3>
          <p className="font-medium text-blue-600">
            {otpMethod === 'phone' ? maskedPhone : maskedEmail}
          </p>
          <p className="mt-2 text-gray-600">
            Please enter the code received from{' '}
            {otpMethod === 'phone' ? 'phone SMS Number' : 'email'}
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <Input
              key={index}
              name={`otp-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]"
              maxLength={1}
              value={digit}
              onChange={(e) => onOtpChange(index, e.target.value)}
              className="h-14 w-14 text-center text-xl font-semibold"
              required
            />
          ))}
        </div>

        {/* Resend info */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Code Sent.{' '}
            {timeLeft > 0
              ? `Resend Code in ${formatTime(timeLeft)}`
              : 'Code expired'}
          </p>
          {otpRef && (
            <p>Ref : #{otpRef}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex space-x-3 border-t border-gray-200 p-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          onClick={onSubmit}
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
          disabled={
            otp.join('').length !== 6 ||
            isLoading ||
            timeLeft <= 0
          }
        >
          {isLoading
            ? 'กำลังยืนยัน...'
            : timeLeft <= 0
              ? 'Code Expired'
              : 'Submit'}
        </Button>
      </div>
    </div>
  )
})

VerifyOTPStep.displayName = 'VerifyOTPStep'