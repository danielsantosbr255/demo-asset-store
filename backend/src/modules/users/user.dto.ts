import { z } from "zod";

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
	password: z.string(),
	created_at: z.date(),
	updated_at: z.date(),
});

export const createUserSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(3).max(50),
	email: z.email(),
	password: z.string().min(6).max(50),
});

export const updateUserSchema = z.object({
	name: z.string().min(3).max(50).optional(),
	email: z.email().optional(),
});

export const userResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
	created_at: z.date(),
	updated_at: z.date(),
});

export type IUser = z.infer<typeof userSchema>;
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type UserResponseDTO = z.infer<typeof userResponseSchema>;
