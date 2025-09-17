import { formatPhoneForAPI } from '@/lib/utils/phone'

import {
  loginRequestSchema,
  signInFormSchema,
  type LoginRequest,
  type SignInFormState,
} from '../schemas'

export const createInitialSignInState = (): SignInFormState => ({
  method: 'phone',
  phone: '',
  email: '',
  password: '',
  keepLoggedIn: false,
})

export type SignInPayloadResult =
  | { success: true; data: LoginRequest }
  | { success: false; error: string }

export const buildLoginPayload = (
  state: SignInFormState,
): SignInPayloadResult => {
  const parsedForm = signInFormSchema.safeParse(state)

  if (!parsedForm.success) {
    const error = parsedForm.error.errors.at(0)
    return {
      success: false,
      error: error?.message ?? 'Invalid credentials',
    }
  }

  const { method, phone, email, password } = parsedForm.data

  const payloadCandidate = {
    ...(method === 'phone'
      ? { phone: formatPhoneForAPI(phone ?? '') }
      : { email: email ?? '' }),
    password,
  }

  const parsedPayload = loginRequestSchema.safeParse(payloadCandidate)

  if (!parsedPayload.success) {
    const error = parsedPayload.error.errors.at(0)
    return {
      success: false,
      error: error?.message ?? 'Invalid credentials',
    }
  }

  return {
    success: true,
    data: parsedPayload.data,
  }
}
