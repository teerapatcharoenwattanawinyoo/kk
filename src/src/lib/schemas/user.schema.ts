import z from 'zod'

export const userSchema = z.object({
  customer_id: z.string(),
  profilename: z.string(),
  email: z.string().email(),
  phone: z.string(),
  avatar: z.string().nullable(),
  platform_type: z.string(),
  company_id: z.string().nullable(),
  team_id: z.string().nullable(),
  device: z.string(),
  team_host_id: z.string(),
})

export const userDataSchema = z.object({
  user: userSchema,
  timestamp: z.number(),
})

// Type inference
export type User = z.infer<typeof userSchema>
export type UserData = z.infer<typeof userDataSchema>

// Validation helpers
export const validateUser = (data: unknown) => {
  return userSchema.safeParse(data)
}

export const validateUserData = (data: unknown) => {
  return userDataSchema.safeParse(data)
}
