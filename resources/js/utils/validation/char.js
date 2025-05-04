import { z } from 'zod'
export const charSchema = z.object({
    id: z.string(),
    role: z.string(),
    description: z.string(),
})