import { useCallback, useState, type Dispatch, type SetStateAction } from 'react'

import { useLogin } from './use-auth'
import { buildLoginPayload, createInitialSignInState, type SignInPayloadResult } from '../services'
import type { ContactMethod, SignInFormState } from '../schemas'

interface UseSignInFormActions {
  setMethod: (method: ContactMethod) => void
  setEmail: (email: string) => void
  setPhone: (phone?: string) => void
  setPassword: (password: string) => void
  setKeepLoggedIn: (keepLoggedIn: boolean) => void
  togglePasswordVisibility: () => void
  setShowForgotPassword: (open: boolean) => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

interface UseSignInFormResult {
  state: SignInFormState
  showPassword: boolean
  showForgotPassword: boolean
  formError: string | null
  loginMutation: ReturnType<typeof useLogin>
  actions: UseSignInFormActions
}

const updateState = (
  updater: (prev: SignInFormState) => SignInFormState,
  setState: Dispatch<SetStateAction<SignInFormState>>,
) => {
  setState((prev) => updater(prev))
}

export const useSignInForm = (): UseSignInFormResult => {
  const loginMutation = useLogin()
  const [state, setState] = useState<SignInFormState>(createInitialSignInState)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const setMethod = useCallback((method: ContactMethod) => {
    updateState((prev) => ({ ...prev, method }), setState)
  }, [])

  const setEmail = useCallback((email: string) => {
    updateState((prev) => ({ ...prev, email }), setState)
  }, [])

  const setPhone = useCallback((phone?: string) => {
    updateState((prev) => ({ ...prev, phone: phone ?? '' }), setState)
  }, [])

  const setPassword = useCallback((password: string) => {
    updateState((prev) => ({ ...prev, password }), setState)
  }, [])

  const setKeepLoggedIn = useCallback((keepLoggedIn: boolean) => {
    updateState((prev) => ({ ...prev, keepLoggedIn }), setState)
  }, [])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const result: SignInPayloadResult = buildLoginPayload(state)

      if (!result.success) {
        setFormError(result.error)
        return
      }

      setFormError(null)
      loginMutation.mutate(result.data)
    },
    [loginMutation, state],
  )

  const actions: UseSignInFormActions = {
    setMethod,
    setEmail,
    setPhone,
    setPassword,
    setKeepLoggedIn,
    togglePasswordVisibility,
    setShowForgotPassword,
    handleSubmit,
  }

  return {
    state,
    showPassword,
    showForgotPassword,
    formError,
    loginMutation,
    actions,
  }
}
