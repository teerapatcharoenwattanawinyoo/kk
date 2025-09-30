// src/app/(public)/policy/_schemas/policy.schema.ts
import { z } from 'zod'

export const PolicyDescriptionSchema = z.object({
  id: z.number(),
  languageId: z.number(),
  policyId: z.number(),
  name: z.string(),
  detail: z.string(),
  createdAt: z.string(),
  createdBy: z.number(),
  updatedAt: z.string().nullable(),
  updatedBy: z.number().nullable(),
  policy_id: z.number(),
})

export const PolicySchema = z.object({
  id: z.number(),
  name: z.string(),
  version: z.string(),
  slug: z.string(),
  status: z.number(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  createdBy: z.number(),
  updatedAt: z.string().nullable(),
  updatedBy: z.number().nullable(),
  descriptions: z.array(PolicyDescriptionSchema),
})

export const GetPolicyResponseSchema = z.object({
  statusCode: z.number(),
  data: z.array(PolicySchema),
  message: z.string(),
})

export type PolicyDescription = z.infer<typeof PolicyDescriptionSchema>
export type Policy = z.infer<typeof PolicySchema>
export type GetPolicyResponse = z.infer<typeof GetPolicyResponseSchema>
