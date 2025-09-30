'use server'

import { api } from '@/lib/api/config/axios-server'
import { pricingPlansResponseSchema, type PricingPlansResponse } from '../_schemas/plans.schema'

export const getPricingPlans = async (teamId: string): Promise<PricingPlansResponse> => {
  try {
    const result = await api.get(`/package/team/${teamId}`)
    const parsedResult = pricingPlansResponseSchema.parse({
      statusCode: 200,
      data: result.data,
      message: 'Success',
    })

    return parsedResult
  } catch (err) {
    console.error('Error fetching pricing plans:', err)
    throw err
  }
}
