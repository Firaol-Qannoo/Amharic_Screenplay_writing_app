import { z } from 'zod'
export const signupSchema = z.object({
    fullname: z.string().regex(/([a-zA-Z])+\s([a-zA-Z])+/, "Please enter your full name"),
    email: z.string().email("Invalid email address"),
   
    password: z.string().min(8, "Password is too short.").max(20, "Password is too long."),
    confirmPassword: z.string(),
    profilePicture: z.instanceof(File, { message: "Invalid Image" }).refine(profilePicture =>
        ["image/png", "image/jpeg", "image/jpg"].includes(profilePicture.type), { message: "Invalid file type" }
    ).optional()

}).refine((data) => data.password === data.confirmPassword, { message: "Password doesn't match", path: ["confirmPassword"] })