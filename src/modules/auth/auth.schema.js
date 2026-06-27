import * as z from "zod";

export const loginSchema = z.strictObject({
    email: z.email(),
    password: z.string()
});

export const registerSchema = z.strictObject({
    email: z.email(),
    password: z.string().min(8),
    name: z.string().optional(),
});