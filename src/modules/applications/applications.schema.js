import * as z from "zod";

export const applicationStatus = z.enum(["WISHLIST", "APPLIED", "INTERVIEW", "REJECTED", "OFFER"]);

export const idSchema = z.coerce.number().int().positive();

export const createApplicationSchema = z.strictObject({
    company: z.string(),
    position: z.string(),
    status: applicationStatus.optional(),
    location: z.string().nullable().optional(),
    notes: z.string().nullable().optional()
});

export const updateApplicationSchema = createApplicationSchema.partial().strict()
.refine(
    data => Object.keys(data).length > 0,
    { message: 'At least one field is required' }
);