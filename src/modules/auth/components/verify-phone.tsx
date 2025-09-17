'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  useRegisterByPhone,
  useVerifyPhoneOtp,
} from '@modules/auth/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : undefined
}

function getVerifyErrorMessage(error: unknown): string {
  function isObject(val: unknown): val is Record<string, unknown> {
    return typeof val === 'object' && val !== null
  }
  if (
    isObject(error) &&
    'response' in error &&
    isObject(error.response) &&
    'data' in error.response &&
    isObject(error.response.data)
  ) {
    const data = error.response.data as Record<string, unknown>
    if (data.statusCode === 401) return 'Invalid or expired OTP'
    if (typeof data.message === 'string') return data.message
  }
  if (
    isObject(error) &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    const msg = (error as { message: string }).message
    if (msg.includes('401')) return 'Invalid or expired OTP'
    return msg
  }
  return 'An error occurred. Please try again.'
}

export default function VerifyPhone() {
  const router = useRouter()
  const [phone, setPhone] = useState<string | null>(null)

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [countdown, setCountdown] = useState(50)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const verifyPhoneOtpMutation = useVerifyPhoneOtp()
  const registerByPhoneMutation = useRegisterByPhone()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookiePhone = getCookie('phone')
      setPhone(cookiePhone ?? '')
    }
  }, [])

  useEffect(() => {
    if (phone === '') {
      router.replace('/sign-in')
    }
  }, [phone, router])

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, otp.length)
  }, [otp.length])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  useEffect(() => {
    if (verifyPhoneOtpMutation.isSuccess) {
      router.push('/create-profile')
    }
  }, [verifyPhoneOtpMutation.isSuccess, router])

  if (phone === null) {
    return null
  }

  if (!phone) {
    return null
  }

  return (
    <Card className="w-full max-w-sm border-0 shadow-none">
      <CardHeader className="px-0 pb-6 text-left">
        <CardTitle className="text-3xl font-bold">Verify OTP</CardTitle>
        <div className="text-primary">{phone}</div>
        <CardDescription className="mt-2 text-sm font-normal text-[#969696]">
          Please enter the code received from SMS to activate your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const enteredOtp = otp.join('')
            verifyPhoneOtpMutation.mutate({ otp: enteredOtp })
          }}
          className="space-y-6"
        >
          <div className="flex justify-start space-x-4">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^[0-9]?$/.test(value)) {
                    const newOtp = [...otp]
                    newOtp[index] = value
                    setOtp(newOtp)
                    if (value && index < otp.length - 1) {
                      inputRefs.current[index + 1]?.focus()
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !otp[index] && index > 0) {
                    inputRefs.current[index - 1]?.focus()
                  }
                }}
                className={`h-14 w-12 rounded-lg border-none text-center text-2xl font-bold ${
                  digit ? 'bg-[#E9EDFF] text-primary' : 'bg-[#E8E6EA]'
                }`}
              />
            ))}
          </div>
          <Button
            type="submit"
            className="h-12 w-full rounded-lg bg-primary text-white hover:bg-primary/90"
            disabled={verifyPhoneOtpMutation.isPending}
          >
            {verifyPhoneOtpMutation.isPending ? 'Verifying...' : 'Submit'}
          </Button>
        </form>
        {verifyPhoneOtpMutation.error && (
          <Alert variant="destructive" className="mt-4 bg-destructive/10">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {getVerifyErrorMessage(verifyPhoneOtpMutation.error)}
            </AlertDescription>
          </Alert>
        )}
        <div className="text-center text-sm font-light text-[#969696]">
          <p>
            Code Sent.{' '}
            {countdown > 0 ? (
              <span>
                Resend Code in{' '}
                <span className="text-[#FD6B22]">
                  00:{countdown.toString().padStart(2, '0')}
                </span>
              </span>
            ) : (
              <Button
                variant="link"
                className="h-auto p-0 text-primary hover:underline"
                onClick={async () => {
                  setCountdown(50)
                  setOtp(Array(6).fill(''))
                  inputRefs.current[0]?.focus()
                  // เรียกขอ OTP ใหม่
                  try {
                    await registerByPhoneMutation.mutateAsync({
                      phone,
                      country_code: getCookie('country_code') || '',
                    })
                  } catch (err) {
                    // handle error (optional)
                    console.error('Error requesting new OTP:', err)
                  }
                }}
              >
                Resend Code
              </Button>
            )}
          </p>
          <p className="mt-1 text-[#969696]">Ref : #2719</p>
        </div>
      </CardContent>
    </Card>
  )
}
