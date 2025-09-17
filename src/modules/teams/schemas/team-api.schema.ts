import { z } from "zod";

export const teamDataSchema = z.object({
  team_host_id: z.number(),
  team_group_id: z.number(),
  team_name: z.string(),
  team_img: z.string(),
  team_company_name: z.string(),
  team_dividual_type_id: z.number(),
  team_tax_fullname: z.string(),
  team_tax_address: z.string(),
  team_tax_id: z.string(),
  team_tax_code: z.string(),
  team_tax_branch: z.string(),
  package: z.string(),
  members: z.number(),
  station: z.number(),
  chargers: z.number(),
  connector: z.number(),
  wallet: z.number(),
});

export const teamHostDataSchema = z.object({
  team_group_id: z.number(),
  team_name: z.string(),
  team_icon_group: z.string().optional(),
});

const paginationSchema = z.object({
  page_current: z.number(),
  page_total: z.number(),
  page_size: z.number(),
  item_total: z.number(),
});

export const teamHostListDataSchema = paginationSchema.extend({
  data: z.array(teamHostDataSchema),
});

export const teamHostListResponseSchema = z.object({
  statusCode: z.number(),
  data: teamHostListDataSchema,
  message: z.string(),
});

export const teamHostListParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
});

export const teamListItemSchema = z.object({
  team_host_id: z.number().nullable(),
  team_group_id: z.number(),
  team_name: z.string(),
  team_icon_group: z.string(),
  team_email: z.string(),
  team_phone: z.string(),
  team_status: z.string(),
  team_company_name: z.string(),
  team_dividual_type_id: z.number(),
  team_tax_fullname: z.string(),
  team_tax_address: z.string(),
  team_tax_id: z.string(),
  team_tax_code: z.string(),
  team_tax_branch: z.string(),
  package: z.string(),
  members: z.number(),
  station: z.number(),
  chargers: z.number(),
  connector: z.number(),
  wallet: z.number(),
});

export const teamListDataSchema = paginationSchema.extend({
  data: z.array(teamListItemSchema),
});

export const teamListResponseSchema = z.object({
  statusCode: z.number(),
  data: teamListDataSchema,
  message: z.string(),
});

export const teamListQueryResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: teamListDataSchema,
});

export const iTeamListResponseSchema = z.object({
  statusCode: z.number(),
  data: teamListDataSchema,
  message: z.string(),
});

export const teamListParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
});

export const createTeamRequestSchema = z.object({
  name: z.string(),
  company_name: z.string(),
  dividual_type_id: z.number(),
  tax_address: z.string(),
  tax_code: z.string(),
  tax_branch: z.string(),
});

export const createTeamResponseSchema = z.object({
  statusCode: z.number(),
  data: teamDataSchema,
  message: z.string(),
});

export const deleteTeamResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
});

export const updateTeamRequestSchema = z.object({
  name: z.string(),
  company_name: z.string(),
  dividual_type_id: z.number(),
  tax_fullname: z.string(),
  tax_address: z.string(),
  tax_code: z.string(),
  tax_branch: z.string(),
  icon_group: z.string().optional(),
  lang_id: z.string().optional(),
});

export const updateTeamResponseSchema = z.object({
  statusCode: z.number(),
  data: teamDataSchema,
  message: z.string(),
});

export type TeamData = z.infer<typeof teamDataSchema>;
export type TeamHostData = z.infer<typeof teamHostDataSchema>;
export type TeamHostListResponse = z.infer<typeof teamHostListResponseSchema>;
export type TeamHostListParams = z.infer<typeof teamHostListParamsSchema>;
export type TeamListData = z.infer<typeof teamListDataSchema>;
export type TeamListResponse = z.infer<typeof teamListResponseSchema>;
export type TeamListParams = z.infer<typeof teamListParamsSchema>;
export type TeamListQueryResponse = z.infer<typeof teamListQueryResponseSchema>;
export type ITeamListResponse = z.infer<typeof iTeamListResponseSchema>;
export type ITeamList = z.infer<typeof teamListItemSchema>;
export type CreateTeamRequest = z.infer<typeof createTeamRequestSchema>;
export type CreateTeamResponse = z.infer<typeof createTeamResponseSchema>;
export type DeleteTeamResponse = z.infer<typeof deleteTeamResponseSchema>;
export type UpdateTeamRequest = z.infer<typeof updateTeamRequestSchema>;
export type UpdateTeamResponse = z.infer<typeof updateTeamResponseSchema>;
