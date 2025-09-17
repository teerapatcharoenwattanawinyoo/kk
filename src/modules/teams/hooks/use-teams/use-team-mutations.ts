import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { IResponse } from '@/lib/api/config/model'
import { QUERY_KEYS } from '@/lib/constants'

import {
  bulkDeleteTeams,
  createTeam,
  deleteTeamById,
  updateTeamById,
} from '@/modules/teams/services'
import type { TeamListQueryResponse, UpdateTeamFormData } from '@/modules/teams/schemas'

import {
  restoreTeamListCaches,
  updateTeamListCaches,
  type TeamListCacheEntry,
} from './cache-helpers'

interface TeamMutationContext {
  previousCaches: TeamListCacheEntry[]
}

export const useCreateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation<IResponse, Error, FormData>({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS, 'list'],
      })
    },
  })
}

export const useUpdateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation<IResponse, Error, UpdateTeamFormData, TeamMutationContext>({
    mutationFn: updateTeamById,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.TEAMS, 'list'],
      })

      const previousCaches = updateTeamListCaches(queryClient, (data) => {
        const updatedTeams = data.data.data.map((team) => {
          if (team.team_group_id.toString() !== variables.id) {
            return team
          }

          return {
            ...team,
            team_name: variables.team_name,
            team_email: variables.team_email,
            team_phone: variables.team_phone,
            team_status: variables.team_status,
          }
        })

        return {
          ...data,
          data: {
            ...data.data,
            data: updatedTeams,
          },
        } satisfies TeamListQueryResponse
      })

      return { previousCaches } satisfies TeamMutationContext
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCaches) {
        restoreTeamListCaches(queryClient, context.previousCaches)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS, 'list'],
      })
    },
  })
}

export const useDeleteTeam = () => {
  const queryClient = useQueryClient()

  return useMutation<IResponse, Error, string, TeamMutationContext>({
    mutationFn: deleteTeamById,
    onMutate: async (teamId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.TEAMS, 'list'],
      })

      const previousCaches = updateTeamListCaches(queryClient, (data) => {
        const filteredTeams = data.data.data.filter(
          (team) => team.team_group_id.toString() !== teamId,
        )

        return {
          ...data,
          data: {
            ...data.data,
            data: filteredTeams,
            item_total: Math.max(0, data.data.item_total - 1),
          },
        } satisfies TeamListQueryResponse
      })

      return { previousCaches } satisfies TeamMutationContext
    },
    onError: (_error, _teamId, context) => {
      if (context?.previousCaches) {
        restoreTeamListCaches(queryClient, context.previousCaches)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS, 'list'],
      })
    },
  })
}

export const useBulkDeleteTeams = () => {
  const queryClient = useQueryClient()

  return useMutation<IResponse[], Error, string[], TeamMutationContext>({
    mutationFn: bulkDeleteTeams,
    onMutate: async (teamIds) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.TEAMS, 'list'],
      })

      const previousCaches = updateTeamListCaches(queryClient, (data) => {
        const teamIdSet = new Set(teamIds)
        const filteredTeams = data.data.data.filter(
          (team) => !teamIdSet.has(team.team_group_id.toString()),
        )

        return {
          ...data,
          data: {
            ...data.data,
            data: filteredTeams,
            item_total: Math.max(0, data.data.item_total - teamIds.length),
          },
        } satisfies TeamListQueryResponse
      })

      return { previousCaches } satisfies TeamMutationContext
    },
    onError: (_error, _teamIds, context) => {
      if (context?.previousCaches) {
        restoreTeamListCaches(queryClient, context.previousCaches)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS, 'list'],
      })
    },
  })
}
