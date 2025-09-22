'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { memo } from 'react'

interface SelectOTPStepProps {
  otpMethod: 'phone' | 'email'
  hasPhone: boolean
  hasEmail: boolean
  maskedPhone: string | null
  maskedEmail: string | null
  isLoading: boolean
  onOtpMethodChange: (value: 'phone' | 'email') => void
  onSendOTP: () => void
  onBack: () => void
}

export const SelectOTPStep = memo(
  ({
    otpMethod,
    hasPhone,
    hasEmail,
    maskedPhone,
    maskedEmail,
    isLoading,
    onOtpMethodChange,
    onSendOTP,
    onBack,
  }: SelectOTPStepProps) => {
    return (
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">ยืนยันการถอนเงิน</h2>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          <div className="text-center">
            <p className="mb-6 text-gray-600">เลือกช่องทางที่ต้องการรับรหัส OTP</p>
          </div>

          {!hasPhone && !hasEmail ? (
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <p className="text-red-600">กรุณาเพิ่มเบอร์โทรศัพท์หรืออีเมลในโปรไฟล์ก่อนถอนเงิน</p>
            </div>
          ) : (
            <Tabs
              value={otpMethod}
              onValueChange={(value: string) => onOtpMethodChange(value as 'phone' | 'email')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 gap-2 bg-transparent">
                {hasPhone && (
                  <TabsTrigger
                    value="phone"
                    className="rounded-xl bg-muted py-2.5 data-[state=active]:bg-[#DCE4FF] data-[state=inactive]:bg-muted data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground"
                  >
                    SMS
                  </TabsTrigger>
                )}
                {hasEmail && (
                  <TabsTrigger
                    value="email"
                    className="rounded-xl bg-muted py-2.5 data-[state=active]:bg-[#DCE4FF] data-[state=inactive]:bg-muted data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground"
                  >
                    Email
                  </TabsTrigger>
                )}
              </TabsList>

              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                {hasPhone && (
                  <TabsContent value="phone" className="mt-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">เบอร์โทรศัพท์</p>
                        <p className="text-sm text-gray-500">{maskedPhone}</p>
                      </div>
                    </div>
                  </TabsContent>
                )}
                {hasEmail && (
                  <TabsContent value="email" className="mt-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">อีเมล</p>
                        <p className="text-sm text-gray-500">{maskedEmail}</p>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </div>
            </Tabs>
          )}
        </div>

        {/* Footer */}
        <div className="flex space-x-3 border-t border-gray-200 p-6">
          <Button variant="outline" onClick={onBack} className="flex-1" disabled={isLoading}>
            Back
          </Button>
          <Button
            type="button"
            onClick={onSendOTP}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            disabled={(!hasPhone && !hasEmail) || isLoading}
          >
            {isLoading ? 'กำลังส่ง OTP...' : 'Send OTP'}
          </Button>
        </div>
      </div>
    )
  },
)

SelectOTPStep.displayName = 'SelectOTPStep'
