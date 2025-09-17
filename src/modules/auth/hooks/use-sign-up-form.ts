import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { useRouter } from 'next/navigation'

import { useRegisterByEmail, useRegisterByPhone } from './use-auth'
import { COUNTRIES, type CountryOption } from '../data'
import {
  buildSignUpPayload,
  createInitialSignUpState,
  filterCountries,
  type SignUpPayloadResult,
} from '../services'
import type { ContactMethod, SignUpFormState } from '../schemas'

interface UseSignUpFormActions {
  setMethod: (method: ContactMethod) => void
  setEmail: (email: string) => void
  setPhone: (phone?: string) => void
  setCountry: (country: string) => void
  setAcceptedTerms: (accepted: boolean) => void
  setSearchQuery: (query: string) => void
  setPolicyDialogOpen: (open: boolean) => void
  handleCheckboxClick: (checked?: boolean | 'indeterminate') => void
  handleAcceptPolicy: () => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
}

interface UseSignUpFormResult {
  state: SignUpFormState
  searchQuery: string
  policyDialogOpen: boolean
  formError: string | null
  countries: CountryOption[]
  filteredCountries: CountryOption[]
  registerByEmail: ReturnType<typeof useRegisterByEmail>
  registerByPhone: ReturnType<typeof useRegisterByPhone>
  actions: UseSignUpFormActions
}

const updateState = (
  updater: (prev: SignUpFormState) => SignUpFormState,
  setState: Dispatch<SetStateAction<SignUpFormState>>,
) => {
  setState((prev) => updater(prev))
}

const extractErrorMessage = (error: unknown): string => {
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    Array.isArray((error as { message?: unknown }).message)
  ) {
    return (error as { message: string[] }).message.join('\n')
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message?: string }).message ?? 'Registration failed'
  }

  return 'Registration failed'
}

export const useSignUpForm = (): UseSignUpFormResult => {
  const router = useRouter()
  const registerByEmail = useRegisterByEmail()
  const registerByPhone = useRegisterByPhone()

  const [state, setState] = useState<SignUpFormState>(createInitialSignUpState)
  const [searchQuery, setSearchQuery] = useState('')
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false)
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

  const setCountry = useCallback((country: string) => {
    updateState((prev) => ({ ...prev, country }), setState)
  }, [])

  const setAcceptedTerms = useCallback((accepted: boolean) => {
    updateState((prev) => ({ ...prev, acceptedTerms: accepted }), setState)
  }, [])

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const updatePolicyDialogOpen = useCallback((open: boolean) => {
    setPolicyDialogOpen(open)
  }, [])

  const handleCheckboxClick = useCallback(
    (checked?: boolean | 'indeterminate') => {
      if (!state.acceptedTerms) {
        setPolicyDialogOpen(true)
        return
      }

      setAcceptedTerms(false)
    },
    [setAcceptedTerms, state.acceptedTerms],
  )

  const handleAcceptPolicy = useCallback(() => {
    setAcceptedTerms(true)
    setPolicyDialogOpen(false)
  }, [setAcceptedTerms])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const result: SignUpPayloadResult = buildSignUpPayload(state)

      if (!result.success) {
        setFormError(result.error)
        return
      }

      setFormError(null)

      const { method, payload } = result.data

      try {
        if (method === 'email') {
          const response = await registerByEmail.mutateAsync(payload)

          if (response.statusCode === 201) {
            router.push('/verify-email')
            return
          }

          setFormError(response.message ?? 'Registration failed')
          return
        }

        const response = await registerByPhone.mutateAsync(payload)

        if (response.statusCode === 201) {
          router.push('/verify-phone')
          return
        }

        setFormError(response.message ?? 'Registration failed')
      } catch (error: unknown) {
        setFormError(extractErrorMessage(error))
      }
    },
    [registerByEmail, registerByPhone, router, state],
  )

  const filteredCountries = useMemo(
    () => filterCountries(COUNTRIES, searchQuery),
    [searchQuery],
  )

  const actions: UseSignUpFormActions = {
    setMethod,
    setEmail,
    setPhone,
    setCountry,
    setAcceptedTerms,
    setSearchQuery: updateSearchQuery,
    setPolicyDialogOpen: updatePolicyDialogOpen,
    handleCheckboxClick,
    handleAcceptPolicy,
    handleSubmit,
  }

  return {
    state,
    searchQuery,
    policyDialogOpen,
    formError,
    countries: COUNTRIES,
    filteredCountries,
    registerByEmail,
    registerByPhone,
    actions,
  }
}
