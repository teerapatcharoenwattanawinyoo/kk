import { QUERY_KEYS } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { pricingPlanSchema, type PricingPlan } from '../_schemas/plans.schema'
import { getPricingPlans } from '../_servers/plans.actions'

export const useTeamPricingPlans = (teamId?: string, initialPlans?: PricingPlan[]) => {
  const safeInitialPlans = (() => {
    if (!initialPlans) {
      return undefined
    }

    try {
      return pricingPlanSchema.array().parse(initialPlans)
    } catch (error) {
      console.error('Invalid initial pricing plans provided:', error)
      return undefined
    }
  })()

  return useQuery<PricingPlan[]>({
    queryKey: [QUERY_KEYS.PRICING_PLANS, teamId],
    queryFn: async () => {
      if (!teamId) {
        throw new Error('Team ID is required to fetch pricing plans')
      }

      const response = await getPricingPlans(teamId)
      return pricingPlanSchema.array().parse(response.data)
    },
    enabled: Boolean(teamId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    initialData: safeInitialPlans,
  })
}

export const useCurrentTeamPlan = (teamId?: string, initialPlans?: PricingPlan[]) => {
  const query = useTeamPricingPlans(teamId, initialPlans)

  const currentPlan = useMemo(() => {
    const plans = query.data ?? []

    const activePlan = plans.find((plan) => plan.is_default)

    if (activePlan) {
      return activePlan
    }

    return plans.length > 0 ? plans[0] : undefined
  }, [query.data])

  return {
    ...query,
    plans: query.data ?? [],
    currentPlan,
  }
}
