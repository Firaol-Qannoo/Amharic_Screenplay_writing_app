import { z } from 'zod'
export const charRelSchema = z.object({
    name: z.string(),
    toId: z.string(),
    description: z.string(),
    type: z.string(),
})