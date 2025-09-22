import { z } from 'zod'

export const pricingPlanSchema = z.object({
  id: z.string(),
  icon_package_path: z.string().optional(),
  package_name: z.string(),
  type_of_prices: z.string(),
  description: z.string(),
  price: z.string(),
  detail: z.array(z.string()),
  discount: z.string().optional(),
  commission: z.string().optional(),
  is_default: z.boolean().optional(),
})

export type PricingPlan = z.infer<typeof pricingPlanSchema>
