import { API_ENDPOINTS } from "@/lib/constants";
import {
  ITeamListResponse,
  TeamData,
  TeamHostListParams,
  TeamHostListResponse,
  TeamListParams,
  TeamListResponse,
} from "@/modules/teams/schemas/team.schema";
import { api } from "../config/axios";
import { IResponse } from "../config/model";

const getTeamListApi = async (params?: TeamListParams) => {
  const queryParams = new URLSearchParams();

  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }

  if (params?.pageSize) {
    queryParams.append("pageSize", params.pageSize.toString());
  }

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  const url = queryParams.toString()
    ? `${API_ENDPOINTS.TEAM_GROUPS.TEAMS.LIST}?${queryParams.toString()}`
    : API_ENDPOINTS.TEAM_GROUPS.TEAMS.LIST;

  return api.get(url) as Promise<IResponse<ITeamListResponse>>;
};

const createTeamApi = async (formData: FormData) => {
  return api.post(
    API_ENDPOINTS.TEAM_GROUPS.TEAMS.CREATE,
    formData
  ) as Promise<IResponse>;
};

const updateTeam = async (id: string, formData: FormData) => {
  return api.put(
    `${API_ENDPOINTS.TEAM_GROUPS.TEAMS.UPDATE.replace("{team_group_id}", id)}`,
    formData
  ) as Promise<IResponse>;
};

const deleteTeamApi = async (id: string) => {
  return api.delete(
    `${API_ENDPOINTS.TEAM_GROUPS.TEAMS.DELETE.replace("{team_group_id}", id)}`
  ) as Promise<IResponse>;
};

// API functions from team.ts
export async function getTeamList(): Promise<TeamListResponse> {
  return await api.get<TeamListResponse>(API_ENDPOINTS.AUTH.TEAM);
}

export async function getTeamHostList(
  params?: TeamHostListParams
): Promise<TeamHostListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }
  if (params?.pageSize) {
    searchParams.set("pageSize", String(params.pageSize));
  }
  if (params?.search?.trim()) {
    searchParams.set("search", params.search);
  }

  const url = `${API_ENDPOINTS.AUTH.TEAM}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  return await api.get<TeamHostListResponse>(url);
}

export async function getTeamById(teamId: string): Promise<TeamData | null> {
  console.log("=== getTeamById called ===");
  console.log("teamId:", teamId, "type:", typeof teamId);

  try {
    console.log("Making API request to:", API_ENDPOINTS.AUTH.TEAM);
    const response = await api.get<TeamListResponse>(API_ENDPOINTS.AUTH.TEAM, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    console.log("API response received:", response);
    console.log("Teams in response:", response.data.data);
    console.log("Looking for team with team_group_id:", teamId);

    const team = response.data.data.find((teamItem: TeamData) => {
      console.log(
        `Comparing team.team_group_id (${teamItem.team_group_id}) with teamId (${teamId})`
      );
      console.log(
        `team.team_group_id.toString() === teamId: ${teamItem.team_group_id.toString() === teamId}`
      );
      return teamItem.team_group_id.toString() === teamId;
    });

    console.log("Found team:", team);
    return team || null;
  } catch (error) {
    console.error("Error fetching team by ID:", error);
    return null;
  }
}

export { createTeamApi, deleteTeamApi, getTeamListApi, updateTeam };
