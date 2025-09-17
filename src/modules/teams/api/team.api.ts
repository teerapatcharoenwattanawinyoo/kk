import {
  createTeamApi as createTeamRequest,
  deleteTeamApi as deleteTeamRequest,
  getTeamById as getTeamByIdRequest,
  getTeamHostList as getTeamHostListRequest,
  getTeamList as getTeamListRequest,
  getTeamListApi as getTeamListApiRequest,
  updateTeam as updateTeamRequest,
} from "@/lib/api/team-group/team";
import type { IResponse } from "@/lib/api/config/model";

import type { TeamHostListParams, TeamListParams } from "@/modules/teams/schemas";

export const requestTeamList = (
  params?: TeamListParams
) => getTeamListApiRequest(params);

export const requestLegacyTeamList = () => getTeamListRequest();

export const requestTeamHostList = (
  params?: TeamHostListParams
) => getTeamHostListRequest(params);

export const requestTeamDetails = (teamId: string) => getTeamByIdRequest(teamId);

export const requestCreateTeam = (formData: FormData): Promise<IResponse> => {
  return createTeamRequest(formData);
};

export const requestUpdateTeam = (
  teamId: string,
  formData: FormData
): Promise<IResponse> => {
  return updateTeamRequest(teamId, formData);
};

export const requestDeleteTeam = (teamId: string): Promise<IResponse> => {
  return deleteTeamRequest(teamId);
};
