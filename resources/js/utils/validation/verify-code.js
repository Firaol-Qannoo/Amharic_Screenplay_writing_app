import { z } from 'zod'
export const verifyCodeSchema = z.object({
    code: z.string().min(6,"Invalid code").max(6,"Invalid code"),

})