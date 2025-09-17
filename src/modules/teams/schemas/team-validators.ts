import { teamFormDataSchema, teamSettingsDataSchema } from './team-form.schema'
import { teamListParamsSchema, teamListQueryResponseSchema } from './team-api.schema'
import { teamSchema } from './team-ui.schema'

export const validateTeamForm = (data: unknown) => {
  return teamFormDataSchema.safeParse(data)
}

export const validateTeamSettings = (data: unknown) => {
  return teamSettingsDataSchema.safeParse(data)
}

export const validateTeamListParams = (data: unknown) => {
  return teamListParamsSchema.safeParse(data)
}

export const validateTeam = (data: unknown) => {
  return teamSchema.safeParse(data)
}

export const validateTeamListResponse = (data: unknown) => {
  return teamListQueryResponseSchema.safeParse(data)
}
