// Team Server Actions - Main team operations
'use server'

import { api } from '@/lib/api/config/axios-server'
import { IResponse } from '@/lib/api/config/model'
import { API_ENDPOINTS } from '@/lib/constants'
import { revalidateTag } from 'next/cache'
import {
  ITeamListResponse,
  TeamData,
  TeamHostListParams,
  TeamHostListResponse,
  TeamListParams,
  TeamListResponse,
  UpdateTeamFormData,
} from '../_schemas/team.schema'

// ===========================
// READ OPERATIONS (QUERIES)
// ===========================

/**
 * Get team list with pagination and search
 */
export async function getTeamsServerAction(
  params?: TeamListParams,
): Promise<IResponse<ITeamListResponse>> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.search) queryParams.append('search', params.search)

    const apiUrl = queryParams.toString()
      ? `${API_ENDPOINTS.TEAM_GROUPS.TEAMS.LIST}?${queryParams.toString()}`
      : API_ENDPOINTS.TEAM_GROUPS.TEAMS.LIST

    const result = await api.get(apiUrl)
    return result
  } catch (error) {
    throw error
  }
}

/**
 * Get team host list for authenticated user
 */
export async function getTeamHostListServerAction(
  params?: TeamHostListParams,
): Promise<TeamHostListResponse> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.search) queryParams.append('search', params.search)

    const apiUrl = queryParams.toString()
      ? `${API_ENDPOINTS.AUTH.TEAM}?${queryParams.toString()}`
      : API_ENDPOINTS.AUTH.TEAM

    const result = await api.get<TeamHostListResponse>(apiUrl)
    return result
  } catch (error) {
    console.error('Error fetching team host list:', error)
    throw error
  }
}

/**
 * Get team by ID (simplified to use list endpoint)
 */
export async function getTeamByIdServerAction(teamId: string): Promise<TeamData | null> {
  try {
    const result = await api.get(API_ENDPOINTS.TEAM_GROUPS.TEAMS.LIST)
    const teams = result.data?.data || result.data || []
    const team = teams.find(
      (t: any) => t.team_group_id?.toString() === teamId || t.id?.toString() === teamId,
    )

    return team || null
  } catch (error) {
    console.error('Error fetching team by ID:', error)
    throw error
  }
}

/**
 * Get simple team list
 */
export async function getTeamListServerAction(): Promise<TeamListResponse> {
  try {
    const result = await api.get<TeamListResponse>(API_ENDPOINTS.TEAM_GROUPS.TEAMS.LIST)
    return result
  } catch (error) {
    console.error('Error fetching team list:', error)
    throw error
  }
}

// ===========================
// WRITE OPERATIONS (MUTATIONS)
// ===========================

/**
 * Create new team
 */
export async function createTeamServerAction(formData: FormData): Promise<IResponse> {
  try {
    const result = await api.post<IResponse>(API_ENDPOINTS.TEAM_GROUPS.TEAMS.CREATE, formData)
    // Revalidate team-related cache
    revalidateTag('teams')
    revalidateTag('team-list')

    return result
  } catch (error) {
    console.error('Error creating team:', error)
    throw error
  }
}

/**
 * Update existing team
 */
export async function updateTeamServerAction(data: UpdateTeamFormData): Promise<IResponse> {
  try {
    const formData = new FormData()
    formData.append('teamId', data.id)
    formData.append('team_name', data.team_name)
    formData.append('team_email', data.team_email)
    formData.append('team_phone', data.team_phone)
    formData.append('team_status', data.team_status)

    if (data.file) {
      formData.append('icon_group', data.file)
    }

    const apiUrl = API_ENDPOINTS.TEAM_GROUPS.TEAMS.UPDATE.replace('{team_group_id}', data.id)
    const result = await api.put<IResponse>(apiUrl, formData)

    // Revalidate team-related cache
    revalidateTag('teams')
    revalidateTag('team-list')
    revalidateTag(`team-${data.id}`)

    return result
  } catch (error) {
    console.error('Error updating team:', error)
    throw error
  }
}

/**
 * Delete team by ID
 */
export async function deleteTeamServerAction(teamId: string): Promise<IResponse> {
  try {
    const apiUrl = API_ENDPOINTS.TEAM_GROUPS.TEAMS.DELETE.replace('{team_group_id}', teamId)
    const result = await api.delete<IResponse>(apiUrl)

    // Revalidate team-related cache
    revalidateTag('teams')
    revalidateTag('team-list')
    revalidateTag(`team-${teamId}`)

    return result
  } catch (error) {
    console.error('Error deleting team:', error)
    throw error
  }
}
