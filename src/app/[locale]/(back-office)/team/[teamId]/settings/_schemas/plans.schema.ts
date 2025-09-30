import { z } from 'zod'

export const pricingPlanSchema = z.object({
  id: z.string(),
  icon_package_path: z.string().optional(),
  package_name: z.string(),
  type_of_prices: z.string(),
  description: z.string(),
  price: z.union([z.string(), z.number()]),
  detail: z.array(z.string()),
  discount: z.union([z.string(), z.number()]).optional(),
  commission: z.union([z.string(), z.number()]).optional(),
  is_default: z.boolean().optional(),
})

export const pricingPlansResponseSchema = z.object({
  statusCode: z.number(),
  data: z.array(pricingPlanSchema),
  message: z.string(),
})

export type PricingPlan = z.infer<typeof pricingPlanSchema>
export type PricingPlansResponse = z.infer<typeof pricingPlansResponseSchema>
