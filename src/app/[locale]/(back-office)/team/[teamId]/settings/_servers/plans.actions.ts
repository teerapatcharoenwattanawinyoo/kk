'use server'

import { api } from '@/lib/api/config/axios-server'
import { revalidateTag } from 'next/cache'
import { PricingPlan } from '../_schemas/plans.schema'

export const getPricingPlans = async (teamId: String, data: PricingPlan) => {
  try {
    const result = await api.get(`/package/team/${teamId}`)
    revalidateTag('team-plans')
    return result.data
  } catch (err) {
    console.error('Error fetching pricing plans:', err)
  }
}
