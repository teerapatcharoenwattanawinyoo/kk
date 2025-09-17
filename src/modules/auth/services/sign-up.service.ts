import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js'

import {
  registerByEmailRequestSchema,
  registerByPhoneRequestSchema,
  signUpFormSchema,
  type RegisterByEmailRequest,
  type RegisterByPhoneRequest,
  type SignUpFormState,
} from '../schemas'

import type { CountryOption } from '../data'

export const createInitialSignUpState = (): SignUpFormState => ({
  method: 'email',
  email: '',
  phone: '',
  country: '',
  acceptedTerms: false,
})

export const normalizePhoneNumber = (phone: string, country: string): string => {
  const countryCode = (country || 'TH') as CountryCode
  const phoneNumber = parsePhoneNumberFromString(phone, countryCode)
  return phoneNumber ? phoneNumber.formatNational().replace(/\D/g, '') : phone
}

export const filterCountries = (countries: CountryOption[], query: string): CountryOption[] => {
  if (!query) return countries
  const normalizedQuery = query.toLowerCase()
  return countries.filter((country) => country.label.toLowerCase().includes(normalizedQuery))
}

export type SignUpPayload =
  | { method: 'email'; payload: RegisterByEmailRequest }
  | { method: 'phone'; payload: RegisterByPhoneRequest }

export type SignUpPayloadResult =
  | { success: true; data: SignUpPayload }
  | { success: false; error: string }

export const buildSignUpPayload = (state: SignUpFormState): SignUpPayloadResult => {
  const parsedForm = signUpFormSchema.safeParse(state)

  if (!parsedForm.success) {
    const error = parsedForm.error.errors.at(0)
    return {
      success: false,
      error: error?.message ?? 'Invalid form data',
    }
  }

  const { method, email, phone, country } = parsedForm.data

  if (method === 'email') {
    const parsedPayload = registerByEmailRequestSchema.safeParse({
      email,
      country_code: country,
    })

    if (!parsedPayload.success) {
      const error = parsedPayload.error.errors.at(0)
      return {
        success: false,
        error: error?.message ?? 'Invalid email registration data',
      }
    }

    return {
      success: true,
      data: { method, payload: parsedPayload.data },
    }
  }

  const parsedPayload = registerByPhoneRequestSchema.safeParse({
    phone: normalizePhoneNumber(phone ?? '', country),
    country_code: country,
  })

  if (!parsedPayload.success) {
    const error = parsedPayload.error.errors.at(0)
    return {
      success: false,
      error: error?.message ?? 'Invalid phone registration data',
    }
  }

  return {
    success: true,
    data: { method, payload: parsedPayload.data },
  }
}
