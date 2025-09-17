import { z } from 'zod'

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
})

export const teamCardPropsSchema = z.object({
  team: teamSchema,
})

export type Team = z.infer<typeof teamSchema>
export type TeamCardProps = z.infer<typeof teamCardPropsSchema>
