'use client'

import {
  useForgotPassword,
  useResetPassword,
  useVerifyEmailOTP,
  useVerifyPhoneOTP,
  type VerifyEmailOTPRequest,
  type VerifyPhoneOTPRequest,
} from '@/app/[locale]/(auth)/_hooks/use-forgot-password'
import { PhoneInput } from '@/components/phone-input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatPhoneForAPI } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import { useCallback, useState } from 'react'

interface ForgotPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = 'select' | 'verify' | 'reset'
type Method = 'phone' | 'email'

export default function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<Step>('select')
  const [method, setMethod] = useState<Method>('phone')
  const [email, setEmail] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [token, setToken] = useState('')

  const forgotPasswordMutation = useForgotPassword()
  const verifyEmailMutation = useVerifyEmailOTP()
  const verifyPhoneMutation = useVerifyPhoneOTP()
  const resetPasswordMutation = useResetPassword()

  const handleReset = () => {
    setStep('select')
    setMethod('phone')
    setEmail('')
    setPhoneValue('')
    setOtp(['', '', '', '', '', ''])
    setPassword('')
    setConfirmPassword('')
    setToken('')
  }

  const handleClose = useCallback(
    (open: boolean) => {
      if (!open) {
        handleReset()
      }
      onOpenChange(open)
    },
    [onOpenChange],
  )

  // Step 1: Send forgot password request
  const handleSendOTP = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      const data = method === 'phone' ? { phone: formatPhoneForAPI(phoneValue) } : { email }

      forgotPasswordMutation.mutate(data, {
        onSuccess: (response) => {
          setToken(response.data.token)
          setStep('verify')
        },
      })
    },
    [method, phoneValue, email, forgotPasswordMutation],
  )

  // Step 2: Verify OTP
  const handleVerifyOTP = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      const otpString = otp.join('')
      if (otpString.length !== 6) return

      const baseData = {
        otp: otpString,
        token,
      }

      const data =
        method === 'phone'
          ? { ...baseData, phone: formatPhoneForAPI(phoneValue) }
          : { ...baseData, email }

      if (method === 'phone') {
        verifyPhoneMutation.mutate(data as VerifyPhoneOTPRequest, {
          onSuccess: (response) => {
            setToken(response.data.token)
            setStep('reset')
          },
        })
      } else {
        verifyEmailMutation.mutate(data as VerifyEmailOTPRequest, {
          onSuccess: (response) => {
            setToken(response.data.token)
            setStep('reset')
          },
        })
      }
    },
    [otp, token, method, phoneValue, email, verifyPhoneMutation, verifyEmailMutation],
  )

  const handleResetPassword = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (password !== confirmPassword) {
        return
      }

      resetPasswordMutation.mutate(
        { token, newPassword: password },
        {
          onSuccess: () => {
            handleClose(false)
          },
        },
      )
    },
    [password, confirmPassword, token, resetPasswordMutation, handleClose],
  )

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`) as HTMLInputElement
      nextInput?.focus()
    }
  }

  const renderStep = () => {
    switch (step) {
      case 'select':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Forgot Password</h2>
              <p className="text-muted-foreground">Forgot your password? Reset it in seconds</p>
            </div>

            <Tabs value={method} onValueChange={(value: string) => setMethod(value as Method)}>
              <TabsList className="grid w-full grid-cols-2 gap-2 bg-transparent">
                <TabsTrigger
                  value="phone"
                  className="rounded-xl bg-muted py-2.5 data-[state=active]:bg-[#DCE4FF] data-[state=inactive]:bg-muted data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground"
                >
                  Phone number
                </TabsTrigger>
                <TabsTrigger
                  value="email"
                  className="rounded-xl bg-muted py-2.5 data-[state=active]:bg-[#DCE4FF] data-[state=inactive]:bg-muted data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground"
                >
                  Email
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSendOTP} className="mt-6 space-y-4">
                <TabsContent value="phone" className="mt-0">
                  <PhoneInput
                    international
                    defaultCountry="TH"
                    value={phoneValue}
                    onChange={setPhoneValue}
                    className="w-full"
                    placeholder="99-902-0922"
                    required
                  />
                </TabsContent>

                <TabsContent value="email" className="mt-0">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="onecharge@gmail.com"
                    className="py-3"
                    required
                  />
                </TabsContent>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending ? 'Sending...' : 'Next'}
                </Button>
              </form>
            </Tabs>
          </div>
        )

      case 'verify':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Verify OTP</h2>
              <p className="text-blue-600">
                {method === 'phone' ? formatPhoneForAPI(phoneValue) : email}
              </p>
              <p className="text-gray-600">
                Please enter the code received from{' '}
                {method === 'phone' ? 'phone SMS Number' : 'email'}
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-6">
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
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="h-14 w-14 text-center text-xl font-semibold"
                    required
                  />
                ))}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={
                  otp.join('').length !== 6 ||
                  verifyEmailMutation.isPending ||
                  verifyPhoneMutation.isPending
                }
              >
                {verifyEmailMutation.isPending || verifyPhoneMutation.isPending
                  ? 'Verifying...'
                  : 'Submit'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>Code Sent. Resend Code in 00:50</p>
                <p>Ref: #2739</p>
              </div>
            </form>
          </div>
        )

      case 'reset':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Create New Password</h2>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-blue-600">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="py-3 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Confirm Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••"
                    className="py-3 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={
                  !password ||
                  !confirmPassword ||
                  password !== confirmPassword ||
                  resetPasswordMutation.isPending
                }
              >
                {resetPasswordMutation.isPending ? 'Resetting...' : 'Submit'}
              </Button>
            </form>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Forgot Password</DialogTitle>
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  )
}
