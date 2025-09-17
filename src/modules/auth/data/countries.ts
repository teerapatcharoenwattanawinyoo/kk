import { countryOptionSchema, type CountryOption } from '../schemas'

const countryData: CountryOption[] = [{ value: 'TH', label: 'Thai' }]

export const COUNTRIES = countryData.map((country) => countryOptionSchema.parse(country))

export type { CountryOption }
