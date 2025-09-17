import { z } from "zod";

export const mutationContextSchema = z.object({
  previousTeams: z
    .object({
      data: z.object({
        data: z.array(z.any()),
      }),
    })
    .partial()
    .optional(),
});

export const useTeamsOptionsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  enabled: z.boolean().optional(),
});

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
