import { useCallback, useState } from 'react'

import {
  useForgotPassword,
  useResetPassword,
  useVerifyEmailOTP,
  useVerifyPhoneOTP,
} from '@/hooks/use-forgot-password'

import {
  buildForgotPasswordRequest,
  buildResetPasswordRequest,
  buildVerifyOtpRequest,
  createInitialForgotPasswordState,
  type ForgotPasswordPayloadResult,
  type ForgotPasswordState,
  type ResetPasswordPayloadResult,
  type VerifyOtpPayloadResult,
} from '../services'
import type { ContactMethod } from '../schemas'

export type ForgotPasswordStep = 'select' | 'verify' | 'reset'

interface UseForgotPasswordDialogActions {
  setMethod: (method: ContactMethod) => void
  setEmail: (email: string) => void
  setPhone: (phone?: string) => void
  setOtpValue: (index: number, value: string) => void
  setPassword: (password: string) => void
  setConfirmPassword: (password: string) => void
  togglePasswordVisibility: () => void
  toggleConfirmPasswordVisibility: () => void
  reset: () => void
  handleSendOtp: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
  handleVerifyOtp: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
  handleResetPassword: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
}

interface UseForgotPasswordDialogResult {
  state: ForgotPasswordState
  step: ForgotPasswordStep
  showPassword: boolean
  showConfirmPassword: boolean
  formError: string | null
  actions: UseForgotPasswordDialogActions
  mutations: {
    forgotPassword: ReturnType<typeof useForgotPassword>
    verifyEmail: ReturnType<typeof useVerifyEmailOTP>
    verifyPhone: ReturnType<typeof useVerifyPhoneOTP>
    resetPassword: ReturnType<typeof useResetPassword>
  }
}

const extractErrorMessage = (error: unknown): string => {
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message?: string }).message ?? 'Operation failed'
  }

  return 'Operation failed'
}

export const useForgotPasswordDialog = (): UseForgotPasswordDialogResult => {
  const forgotPassword = useForgotPassword()
  const verifyEmail = useVerifyEmailOTP()
  const verifyPhone = useVerifyPhoneOTP()
  const resetPassword = useResetPassword()

  const [state, setState] = useState<ForgotPasswordState>(createInitialForgotPasswordState())
  const [step, setStep] = useState<ForgotPasswordStep>('select')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const setMethod = useCallback((method: ContactMethod) => {
    setState((prev) => ({ ...prev, method }))
  }, [])

  const setEmail = useCallback((email: string) => {
    setState((prev) => ({ ...prev, email }))
  }, [])

  const setPhone = useCallback((phone?: string) => {
    setState((prev) => ({ ...prev, phone: phone ?? '' }))
  }, [])

  const setOtpValue = useCallback((index: number, value: string) => {
    if (value.length > 1 || /[^0-9]/.test(value)) {
      return
    }

    setState((prev) => {
      const nextOtp = [...prev.otp]
      nextOtp[index] = value
      return { ...prev, otp: nextOtp }
    })
  }, [])

  const setPassword = useCallback((password: string) => {
    setState((prev) => ({ ...prev, password }))
  }, [])

  const setConfirmPassword = useCallback((password: string) => {
    setState((prev) => ({ ...prev, confirmPassword: password }))
  }, [])

  const reset = useCallback(() => {
    setState(createInitialForgotPasswordState())
    setStep('select')
    setShowPassword(false)
    setShowConfirmPassword(false)
    setFormError(null)
  }, [])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev)
  }, [])

  const handleSendOtp = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const result: ForgotPasswordPayloadResult = buildForgotPasswordRequest(state)

      if (!result.success) {
        setFormError(result.error)
        return
      }

      setFormError(null)

      try {
        const { method, payload } = result.data
        const response = await forgotPassword.mutateAsync(payload)
        setState((prev) => ({ ...prev, token: response.data.token }))
        setStep('verify')
      } catch (error: unknown) {
        setFormError(extractErrorMessage(error))
      }
    },
    [forgotPassword, state],
  )

  const handleVerifyOtp = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const result: VerifyOtpPayloadResult = buildVerifyOtpRequest(state)

      if (!result.success) {
        setFormError(result.error)
        return
      }

      setFormError(null)

      try {
        const { method, payload } = result.data

        if (method === 'phone') {
          const response = await verifyPhone.mutateAsync(payload)
          setState((prev) => ({ ...prev, token: response.data.token }))
          setStep('reset')
          return
        }

        const response = await verifyEmail.mutateAsync(payload)
        setState((prev) => ({ ...prev, token: response.data.token }))
        setStep('reset')
      } catch (error: unknown) {
        setFormError(extractErrorMessage(error))
      }
    },
    [state, verifyEmail, verifyPhone],
  )

  const handleResetPassword = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const result: ResetPasswordPayloadResult = buildResetPasswordRequest(state)

      if (!result.success) {
        setFormError(result.error)
        return
      }

      setFormError(null)

      try {
        await resetPassword.mutateAsync(result.data)
        reset()
      } catch (error: unknown) {
        setFormError(extractErrorMessage(error))
      }
    },
    [reset, resetPassword, state],
  )

  const actions: UseForgotPasswordDialogActions = {
    setMethod,
    setEmail,
    setPhone,
    setOtpValue,
    setPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    reset,
    handleSendOtp,
    handleVerifyOtp,
    handleResetPassword,
  }

  return {
    state,
    step,
    showPassword,
    showConfirmPassword,
    formError,
    actions,
    mutations: {
      forgotPassword,
      verifyEmail,
      verifyPhone,
      resetPassword,
    },
  }
}
