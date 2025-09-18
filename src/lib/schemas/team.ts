import { z } from "zod";

// Team API Response schemas
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
  team_img: z.string().optional(),
});

export const teamHostListResponseSchema = z.object({
  statusCode: z.number(),
  data: z.object({
    page_current: z.number(),
    page_total: z.number(),
    page_size: z.number(),
    item_total: z.number(),
    data: z.array(teamHostDataSchema),
  }),
  message: z.string(),
});

export const teamHostListParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
});

export const teamListResponseSchema = z.object({
  statusCode: z.number(),
  data: z.object({
    page_current: z.number(),
    page_total: z.number(),
    page_size: z.number(),
    item_total: z.number(),
    data: z.array(teamDataSchema),
  }),
  message: z.string(),
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

// Type inference from Zod schemas
export type TeamData = z.infer<typeof teamDataSchema>;
export type TeamHostData = z.infer<typeof teamHostDataSchema>;
export type TeamHostListResponse = z.infer<typeof teamHostListResponseSchema>;
export type TeamHostListParams = z.infer<typeof teamHostListParamsSchema>;
export type TeamListResponse = z.infer<typeof teamListResponseSchema>;
export type CreateTeamRequest = z.infer<typeof createTeamRequestSchema>;
export type CreateTeamResponse = z.infer<typeof createTeamResponseSchema>;
export type DeleteTeamResponse = z.infer<typeof deleteTeamResponseSchema>;
export type UpdateTeamRequest = z.infer<typeof updateTeamRequestSchema>;
export type UpdateTeamResponse = z.infer<typeof updateTeamResponseSchema>;

// Common file validation
const fileSchema = z.custom<File>(
  (val) => {
    if (!val) return true; // File is optional
    if (!(val instanceof File)) return false;

    // Check file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (!validTypes.includes(val.type)) return false;

    // Check file size (10MB limit)
    if (val.size > 10 * 1024 * 1024) return false;

    return true;
  },
  {
    message:
      "File must be a valid image (PNG, JPG, JPEG) or PDF, and less than 10MB",
  },
);

// Team API schemas
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

export const iTeamListResponseSchema = z.object({
  statusCode: z.number(),
  data: z.object({
    page_current: z.number(),
    page_total: z.number(),
    page_size: z.number(),
    item_total: z.number(),
    data: z.array(teamDataSchema),
  }),
  message: z.string(),
});

export const teamListParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
});

// Team form schemas
export const teamFormDataSchema = z.object({
  team_name: z
    .string()
    .min(1, "team.team_name_required")
    .max(100, "Team name must not exceed 100 characters")
    .regex(/^[a-zA-Zก-๙0-9\s\-_]+$/, "Team name contains invalid characters"),
  team_email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  team_phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  team_status: z.enum(["publish", "draft", "inactive"], {
    required_error: "Please select a status",
  }),
  file: fileSchema.optional(),
});

export const updateTeamFormDataSchema = teamFormDataSchema.extend({
  id: z.string(),
});

// Team component schemas
export const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().optional(),
  members: z.number(),
  stations: z.number(),
  chargers: z.number(),
  connectors: z.number(),
  package: z.string(),
  wallet: z.number(),
});

export const teamCardPropsSchema = z.object({
  team: teamSchema,
});

export const teamSettingsDataSchema = teamFormDataSchema.extend({
  language: z.string(),
});

// Hook schemas
export const mutationContextSchema = z.object({
  previousTeams: z.any().optional(),
});

export const useTeamsOptionsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  enabled: z.boolean().optional(),
});

// Type inference
export type ITeamList = z.infer<typeof teamListItemSchema>;
export type ITeamListResponse = z.infer<typeof iTeamListResponseSchema>;
export type TeamListParams = z.infer<typeof teamListParamsSchema>;
export type TeamFormData = z.infer<typeof teamFormDataSchema>;
export type UpdateTeamFormData = z.infer<typeof updateTeamFormDataSchema>;
export type Team = z.infer<typeof teamSchema>;
export type TeamCardProps = z.infer<typeof teamCardPropsSchema>;
export type TeamSettingsData = z.infer<typeof teamSettingsDataSchema>;
export type MutationContext = z.infer<typeof mutationContextSchema>;
export type UseTeamsOptions = z.infer<typeof useTeamsOptionsSchema>;

export interface MutationContextWithResponse {
  previousTeams:
    | {
        data?: Array<{
          id: string;
          [key: string]: unknown;
        }>;
        [key: string]: unknown;
      }
    | undefined;
}

// Validation helpers
export const validateTeamForm = (data: unknown) => {
  return teamFormDataSchema.safeParse(data);
};

export const validateTeamListParams = (data: unknown) => {
  return teamListParamsSchema.safeParse(data);
};

export const validateTeam = (data: unknown) => {
  return teamSchema.safeParse(data);
};
