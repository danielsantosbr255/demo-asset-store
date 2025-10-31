import { z } from "zod";

export const sessionSchema = z.object({
	id: z.string(),
	user_id: z.string(),
	user_agent: z.string(),
	ip: z.string(),
	created_at: z.date(),
	updated_at: z.date(),
	expires_at: z.date(),
});

export const createSessionSchema = z.object({
	id: z.string().optional(),
	user_id: z.string(),
	user_agent: z.string(),
	ip: z.string(),
	expires_at: z.date().optional(),
});

export const updateSessionSchema = z.object({
	updated_at: z.date().optional(),
	expires_at: z.date().optional(),
});

export type ISession = z.infer<typeof sessionSchema>;
export type CreateSessionDTO = z.infer<typeof createSessionSchema>;
export type UpdateSessionDTO = z.infer<typeof updateSessionSchema>;
