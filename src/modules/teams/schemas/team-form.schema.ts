import { z } from 'zod'

import { teamFileSchema } from './team-shared.schema'

export const teamFormDataSchema = z.object({
  team_name: z
    .string()
    .min(1, 'team.team_name_required')
    .max(100, 'Team name must not exceed 100 characters')
    .regex(/^[a-zA-Zก-๙0-9\s\-_]+$/, 'Team name contains invalid characters'),
  team_email: z.string().min(1, 'Email is required').email('Invalid email format'),
  team_phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  team_status: z.enum(['publish', 'draft', 'inactive'], {
    required_error: 'Please select a status',
  }),
  file: teamFileSchema.optional(),
})

export const updateTeamFormDataSchema = teamFormDataSchema.extend({
  id: z.string(),
})

export const teamSettingsDataSchema = teamFormDataSchema.extend({
  language: z.string(),
})

export type TeamFormData = z.infer<typeof teamFormDataSchema>
export type UpdateTeamFormData = z.infer<typeof updateTeamFormDataSchema>
export type TeamSettingsData = z.infer<typeof teamSettingsDataSchema>
