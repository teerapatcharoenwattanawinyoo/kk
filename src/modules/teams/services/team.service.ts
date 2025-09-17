import type { ZodError, ZodSchema } from "zod";

import {
  requestCreateTeam,
  requestDeleteTeam,
  requestLegacyTeamList,
  requestTeamDetails,
  requestTeamHostList,
  requestTeamList,
  requestUpdateTeam,
} from "@/modules/teams/api";
import {
  teamDataSchema,
  teamHostListResponseSchema,
  teamListDataSchema,
  teamListResponseSchema,
  type TeamData,
  type TeamHostListParams,
  type TeamHostListResponse,
  type TeamListParams,
  type TeamListQueryResponse,
  type TeamListResponse,
  type UpdateTeamFormData,
} from "@/modules/teams/schemas";
import type { IResponse } from "@/lib/api/config/model";

const parseWithSchema = <T>(schema: ZodSchema<T>, payload: unknown, context: string): T => {
  const result = schema.safeParse(payload);

  if (!result.success) {
    const error = result.error as ZodError;
    console.error(`[teamService] Failed to parse ${context}:`, error.flatten());
    throw error;
  }

  return result.data;
};

const resolveTeamListData = (raw: unknown, fallback: { statusCode?: number; message?: string }): TeamListQueryResponse => {
  const parsedResponse = teamListResponseSchema.safeParse(raw);

  if (parsedResponse.success) {
    return parsedResponse.data;
  }

  const parsedData = teamListDataSchema.safeParse(raw);

  if (parsedData.success) {
    return {
      statusCode: fallback.statusCode ?? 200,
      message: fallback.message ?? "",
      data: parsedData.data,
    };
  }

  throw parsedResponse.error;
};

export const fetchTeamList = async (
  params?: TeamListParams
): Promise<TeamListQueryResponse> => {
  const response = await requestTeamList(params);

  return resolveTeamListData(response.data, {
    statusCode: response.statusCode,
    message: response.message,
  });
};

export const fetchLegacyTeamList = async (): Promise<TeamListResponse> => {
  const response = await requestLegacyTeamList();
  return parseWithSchema(teamListResponseSchema, response, "legacy team list response");
};

export const fetchTeamHostList = async (
  params?: TeamHostListParams
): Promise<TeamHostListResponse> => {
  const response = await requestTeamHostList(params);
  return parseWithSchema(teamHostListResponseSchema, response, "team host list response");
};

export const fetchTeamDetails = async (teamId: string): Promise<TeamData | null> => {
  const response = await requestTeamDetails(teamId);
  if (!response) {
    return null;
  }

  return parseWithSchema(teamDataSchema, response, "team details");
};

export const createTeam = async (formData: FormData): Promise<IResponse> => {
  return requestCreateTeam(formData);
};

export const buildUpdateTeamFormData = (data: UpdateTeamFormData) => {
  const formData = new FormData();

  formData.append("team_name", data.team_name);
  formData.append("team_email", data.team_email);
  formData.append("team_phone", data.team_phone);
  formData.append("team_status", data.team_status);

  if (data.file) {
    formData.append("icon_group", data.file);
  }

  return formData;
};

export const updateTeamById = async (
  data: UpdateTeamFormData
): Promise<IResponse> => {
  const formData = buildUpdateTeamFormData(data);
  return requestUpdateTeam(data.id, formData);
};

export const deleteTeamById = async (teamId: string): Promise<IResponse> => {
  return requestDeleteTeam(teamId);
};

export const bulkDeleteTeams = async (teamIds: string[]): Promise<IResponse[]> => {
  return Promise.all(teamIds.map((teamId) => deleteTeamById(teamId)));
};
