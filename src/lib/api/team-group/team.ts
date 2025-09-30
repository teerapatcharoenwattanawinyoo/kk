import { API_ENDPOINTS } from '@/lib/constants'

import {
  ITeamListResponse,
  TeamData,
  TeamHostListParams,
  TeamHostListResponse,
  TeamListParams,
  TeamListResponse,
} from '@/app/[locale]/(back-office)/team/_schemas'
import { api } from '../config/axios'
import { IResponse } from '../config/model'

const getTeamListApi = async (params?: TeamListParams) => {
  const queryParams = new URLSearchParams()

  if (params?.page) {
    queryParams.append('page', params.page.toString())
  }

  if (params?.pageSize) {
    queryParams.append('pageSize', params.pageSize.toString())
  }

  if (params?.search) {
    queryParams.append('search', params.search)
  }

  const url = queryParams.toString()
    ? `${API_ENDPOINTS.TEAM_GROUPS.TEAMS.LIST}?${queryParams.toString()}`
    : API_ENDPOINTS.TEAM_GROUPS.TEAMS.LIST

  return api.get(url) as Promise<IResponse<ITeamListResponse>>
}

const createTeamApi = async (formData: FormData) => {
  return api.post(API_ENDPOINTS.TEAM_GROUPS.TEAMS.CREATE, formData) as Promise<IResponse>
}

const updateTeam = async (id: string, formData: FormData) => {
  return api.put(
    `${API_ENDPOINTS.TEAM_GROUPS.TEAMS.UPDATE.replace('{team_group_id}', id)}`,
    formData,
  ) as Promise<IResponse>
}

const deleteTeamApi = async (id: string) => {
  return api.delete(
    `${API_ENDPOINTS.TEAM_GROUPS.TEAMS.DELETE.replace('{team_group_id}', id)}`,
  ) as Promise<IResponse>
}

// API functions from team.ts
export async function getTeamList(): Promise<TeamListResponse> {
  return await api.get<TeamListResponse>(API_ENDPOINTS.AUTH.TEAM)
}

export async function getTeamHostList(params?: TeamHostListParams): Promise<TeamHostListResponse> {
  const searchParams = new URLSearchParams()

  if (params?.page) {
    searchParams.set('page', String(params.page))
  }
  if (params?.pageSize) {
    searchParams.set('pageSize', String(params.pageSize))
  }
  if (params?.search?.trim()) {
    searchParams.set('search', params.search)
  }

  const url = `${API_ENDPOINTS.AUTH.TEAM}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  return await api.get<TeamHostListResponse>(url)
}

export async function getTeamById(teamId: string): Promise<TeamData | null> {
  try {
    const response = await api.get<TeamListResponse>(API_ENDPOINTS.AUTH.TEAM, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })

    const team = response.data.data.find((teamItem: TeamData) => {
      return teamItem.team_group_id.toString() === teamId
    })

    return team || null
  } catch (error) {
    return null
  }
}

export { createTeamApi, deleteTeamApi, getTeamListApi, updateTeam }
