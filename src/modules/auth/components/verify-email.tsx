'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useResendEmailOtp, useVerifyEmail } from '@/modules/auth/hooks/use-auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : undefined
}

function getVerifyErrorMessage(error: unknown): string {
  // Type guard สำหรับ error ที่เป็น object
  function isObject(val: unknown): val is Record<string, unknown> {
    return typeof val === 'object' && val !== null
  }

  // ตรวจสอบ response.data
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

  // ตรวจสอบ message ตรงๆ
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

export default function VerifyEmail() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  // เรียก hooks ทั้งหมดไว้บนสุด ห้ามมีเงื่อนไขก่อนเรียก
  const maskedEmail = email ? email.replace(/(.).+(@.+)/, (_, a, b) => a + '****' + b) : 'Null'
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [countdown, setCountdown] = useState(50)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const verifyEmailMutation = useVerifyEmail()
  const resendEmailOtpMutation = useResendEmailOtp()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookieEmail = getCookie('register_email')
      setEmail(cookieEmail ?? '')
    }
  }, [])

  useEffect(() => {
    // รอจน email !== null (แปลว่าอ่าน cookie เสร็จแล้ว)
    if (email === '') {
      router.replace('/sign-in')
    }
  }, [email, router])

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
    if (verifyEmailMutation.isSuccess) {
      router.push('/create-profile')
    }
  }, [verifyEmailMutation.isSuccess, router])

  // ยังไม่อ่าน cookie เสร็จ ไม่ render อะไรเลย (หรือจะใส่ loading ก็ได้)
  if (email === null) {
    return null
  }

  if (!email) {
    // ไม่ render อะไรเลยระหว่าง redirect
    return null
  }

  return (
    <Card className="w-full max-w-sm border-0 shadow-none">
      <CardHeader className="px-0 pb-6 text-left">
        <CardTitle className="text-3xl font-bold">Verify OTP</CardTitle>
        <Link href={`mailto:${email}`} className="text-primary hover:underline">
          {maskedEmail}
        </Link>
        <CardDescription className="mt-2 text-sm font-normal text-[#969696]">
          Please enter the code received from email or verify in email with a link to activate your
          account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <div className="flex items-center justify-start space-x-4">
          <Link
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary"
          >
            <Image src="/assets/images/icons/gmail_icon.svg" alt="Gmail" width={30} height={30} />
            <span className="text-primary underline">Open Gmail</span>
          </Link>
          <Link
            href="https://outlook.live.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary"
          >
            <Image
              src="/assets/images/icons/outlook_icon.svg"
              alt="Outlook"
              width={35}
              height={35}
            />
            <span className="text-primary underline">Open Outlook</span>
          </Link>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const enteredOtp = otp.join('')
            verifyEmailMutation.mutate({
              email,
              otp: enteredOtp,
            })
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
            disabled={verifyEmailMutation.isPending}
          >
            {verifyEmailMutation.isPending ? 'Verifying...' : 'Submit'}
          </Button>
        </form>
        {verifyEmailMutation.error && (
          <Alert variant="destructive" className="mt-4 bg-destructive/10">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{getVerifyErrorMessage(verifyEmailMutation.error)}</AlertDescription>
          </Alert>
        )}
        <div className="text-center text-sm font-light text-[#969696]">
          <p>
            Code Sent.{' '}
            {countdown > 0 ? (
              <span>
                Resend Code in{' '}
                <span className="text-[#FD6B22]">00:{countdown.toString().padStart(2, '0')}</span>
              </span>
            ) : (
              <Button
                variant="link"
                className="h-auto p-0 text-primary hover:underline"
                onClick={async () => {
                  setCountdown(50)
                  setOtp(Array(6).fill(''))
                  inputRefs.current[0]?.focus()
                  try {
                    await resendEmailOtpMutation.mutateAsync()
                  } catch (err) {
                    // handle error (optional)
                    console.error('Error requesting new OTP:', err)
                  }
                }}
                disabled={resendEmailOtpMutation.isPending}
              >
                {resendEmailOtpMutation.isPending ? 'Sending...' : 'Resend Code'}
              </Button>
            )}
          </p>
          <p className="mt-1 text-[#969696]">Ref : #2719</p>
        </div>
      </CardContent>
    </Card>
  )
}
