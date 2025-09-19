import { z } from 'zod'

// ==========================
// ENUMS
// ==========================
export enum EBankStatus {
  APPROVE = 'approve',
  WAITING = 'waiting',
  UNAPPROVE = 'unapprove',
}

// ==========================
// ZOD SCHEMAS
// ==========================

// Bank Account Response Schema (จาก API response)
export const bankAccountResponseSchema = z.object({
  id: z.number(),
  bank_id: z.number(),
  account_name: z.string(),
  account_number: z.string(),
  status: z.nativeEnum(EBankStatus),
  is_primary: z.boolean(),
  file_name: z.string().optional(),
  reason: z.string().nullable().optional(),
  bank_logo: z.string().optional(),
  bank_name: z.string().optional(),
})

// Bank Account Create Schema (สำหรับส่ง API)
export const bankAccountCreateSchema = z.object({
  bank_id: z.number(),
  account_name: z.string().min(1, 'Account name is required'),
  account_number: z.string().min(1, 'Account number is required'),
  is_primary: z.boolean(),
  file: z.instanceof(File).optional(),
})

// Bank Account Update Schema
export const bankAccountUpdateSchema = z.object({
  account_name: z.string().min(1, 'Account name is required').optional(),
  account_number: z.string().min(1, 'Account number is required').optional(),
  is_primary: z.boolean().optional(),
  bank_id: z.number().optional(),
  file: z.instanceof(File).optional(),
})

// Bank List Item Schema
export const bankListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
})

// ==========================
// TYPE EXPORTS
// ==========================
export type IBankAccountResponse = z.infer<typeof bankAccountResponseSchema>
export type IBankAccount = z.infer<typeof bankAccountCreateSchema>
export type IBankAccountUpdate = z.infer<typeof bankAccountUpdateSchema>
export type IBankListItem = z.infer<typeof bankListItemSchema>

export type BankAccountListResponse = IBankAccountResponse[]
export type BankAccountDetailResponse = IBankAccountResponse
export type BankListResponse = IBankListItem[]
export type BankAccountMutationResponse = IBankAccount // mutation response data

// ==========================
// VALIDATION HELPERS
// ==========================
export const validateBankAccountCreate = (data: unknown) => {
  return bankAccountCreateSchema.safeParse(data)
}

export const validateBankAccountUpdate = (data: unknown) => {
  return bankAccountUpdateSchema.safeParse(data)
}
