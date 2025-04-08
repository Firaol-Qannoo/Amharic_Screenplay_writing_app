import { z } from 'zod'
export const resetPasswordSchema = z.object({
 
    password: z.string().min(8, "Password is too short.").max(20, "Password is too long."),
    confirmPassword: z.string(),


}).refine((data) => data.password === data.confirmPassword, { message: "Password doesn't match", path: ["confirmPassword"] })