import { IResponse } from '@/lib/api/config/model'
import {
  getTeamById,
  getTeamList
} from '@/lib/api/team-group/team'
import { QUERY_KEYS } from '@/lib/constants'
import { useLocalStorage } from '@/lib/helpers/storage'
import { UserData } from '@/lib/schemas/user.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  ITeamListResponse,
  TeamData,
  TeamHostListParams,
  TeamHostListResponse,
  TeamListParams,
  TeamListResponse,
  UpdateTeamFormData,
} from '../_schemas/team.schema'
import {
  createTeamServerAction,
  deleteTeamServerAction,
  getTeamHostListServerAction,
  getTeamsServerAction,
  updateTeamServerAction,
} from '../_servers/team.actions'

// Specific type for this hook
interface MutationContext {
  previousTeams: IResponse<ITeamListResponse> | undefined
}

// Hook สำหรับดึงรายการ Team พร้อม pagination
export const useTeams = (params?: TeamListParams) => {
  return useQuery<IResponse<ITeamListResponse>>({
    queryKey: [QUERY_KEYS.TEAMS, 'list', params],
    queryFn: () => getTeamsServerAction(params),
    staleTime: 5 * 60 * 1000, // ข้อมูลจะถือว่าใหม่เป็นเวลา 5 นาที
    gcTime: 10 * 60 * 1000, // เก็บข้อมูลใน cache เป็นเวลา 10 นาที
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

// Hook สำหรับสร้าง Team ใหม่
export const useCreateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation<IResponse, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const result = await createTeamServerAction(formData)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS, 'list'],
      })
    },
    onError: (error) => {
      console.error('Error creating team:', error)
    },
  })
}

// Hook สำหรับอัปเดต Team
export const useUpdateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation<IResponse, Error, UpdateTeamFormData, MutationContext>({
    mutationFn: async (data: UpdateTeamFormData) => {
      return updateTeamServerAction(data)
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.TEAMS, 'list'],
      })

      const previousTeams = queryClient.getQueryData<
        IResponse<ITeamListResponse>
      >([QUERY_KEYS.TEAMS, 'list'])

      queryClient.setQueryData(
        [QUERY_KEYS.TEAMS, 'list'],
        (old: IResponse<ITeamListResponse> | undefined) => {
          if (!old?.data) return old

          const updatedData = Array.isArray(old.data)
            ? old.data.map((team) =>
                team.id.toString() === variables.id
                  ? { ...team, ...variables }
                  : team,
              )
            : old.data

          return {
            ...old,
            data: updatedData,
          }
        },
      )

      return { previousTeams }
    },
    onError: (error, variables, context) => {
      if (context?.previousTeams) {
        queryClient.setQueryData(
          [QUERY_KEYS.TEAMS, 'list'],
          context.previousTeams,
        )
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS, 'list'],
      })
    },
  })
}

// Hook สำหรับลบ Team
export const useDeleteTeam = () => {
  const queryClient = useQueryClient()

  return useMutation<IResponse, Error, string, MutationContext>({
    mutationFn: (teamId: string) => deleteTeamServerAction(teamId),
    onMutate: async (teamId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.TEAMS, 'list'],
      })

      const previousTeams = queryClient.getQueryData<
        IResponse<ITeamListResponse>
      >([QUERY_KEYS.TEAMS, 'list'])

      queryClient.setQueryData(
        [QUERY_KEYS.TEAMS, 'list'],
        (old: IResponse<ITeamListResponse> | undefined) => {
          if (!old?.data) return old

          const filteredData = Array.isArray(old.data)
            ? old.data.filter((team) => team.id.toString() !== teamId)
            : old.data

          return {
            ...old,
            data: filteredData,
          }
        },
      )

      return { previousTeams }
    },
    onError: (error, teamId, context) => {
      if (context?.previousTeams) {
        queryClient.setQueryData(
          [QUERY_KEYS.TEAMS, 'list'],
          context.previousTeams,
        )
      }
      console.error('Error deleting team:', error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS, 'list'],
      })
    },
  })
}

export const useTeamById = (teamId: string) => {
  const { data: teamsData, isLoading, error } = useTeams()

  const team =
    teamsData?.data && Array.isArray(teamsData.data.data)
      ? teamsData.data.data.find(
          (team) => team.team_group_id.toString() === teamId,
        )
      : null

  return {
    team,
    isLoading,
    error,
    isNotFound: !isLoading && !error && teamsData?.data && !team,
  }
}

// Backward compatible version that returns just the team data
export const useTeamData = (teamId: string) => {
  const { team } = useTeamById(teamId)
  return team
}

export const useTeamHostId = () => {
  const userData = useUserData()
  return userData?.user?.team_host_id || null
}

export const useUserData = () => {
  const [userData] = useLocalStorage<UserData | null>('user_data', null)
  return userData
}

export const useBulkDeleteTeams = () => {
  const queryClient = useQueryClient()

  return useMutation<IResponse[], Error, string[]>({
    mutationFn: async (teamIds: string[]) => {
      const deletePromises = teamIds.map((id) => deleteTeamServerAction(id))
      return Promise.all(deletePromises)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEAMS, 'list'],
      })
    },
    onError: (error) => {
      console.error('Error bulk deleting teams:', error)
    },
  })
}

export const useTeamHostList = (params?: TeamHostListParams) => {
  return useQuery<TeamHostListResponse>({
    queryKey: [...QUERY_KEYS.TEAMS, 'host-list', params],
    queryFn: () => getTeamHostListServerAction(params),
    refetchOnWindowFocus: false, // ไม่ refetch เมื่อกลับมาที่ window
    refetchOnMount: false, // ไม่ refetch เมื่อ component mount ใหม่
    staleTime: 5 * 60 * 1000, // ข้อมูลจะถือว่าใหม่เป็นเวลา 5 นาที
    gcTime: 10 * 60 * 1000, // เก็บข้อมูลใน cache เป็นเวลา 10 นาที
  })
}

export const useTeamHostById = (teamId: string) => {
  const { data, isLoading, error } = useTeamHostList()

  const teamData = useMemo(() => {
    if (!data?.data?.data || !teamId) return null
    return (
      data.data.data.find((team) => team.team_group_id.toString() === teamId) ||
      null
    )
  }, [data, teamId])

  return {
    ...teamData,
    isLoading,
    error,
  }
}

export const useTeamList = () => {
  return useQuery<TeamListResponse>({
    queryKey: QUERY_KEYS.TEAMS,
    queryFn: getTeamList,
    refetchOnWindowFocus: false, // ไม่ refetch เมื่อกลับมาที่ window
    refetchOnMount: false, // ไม่ refetch เมื่อ component mount ใหม่
    staleTime: 5 * 60 * 1000, // ข้อมูลจะถือว่าใหม่เป็นเวลา 5 นาที
    gcTime: 10 * 60 * 1000, // เก็บข้อมูลใน cache เป็นเวลา 10 นาที
  })
}

export const useTeam = (teamId: string) => {
  return useQuery<TeamData | null>({
    queryKey: [...QUERY_KEYS.TEAM, teamId],
    queryFn: () => {
      return getTeamById(teamId)
    },
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000, // ข้อมูลจะถือว่าใหม่เป็นเวลา 5 นาที
    gcTime: 10 * 60 * 1000, // เก็บข้อมูลใน cache เป็นเวลา 10 นาที
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}
