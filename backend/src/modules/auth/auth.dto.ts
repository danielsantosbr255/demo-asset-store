import { z } from "zod";

export const signInSchema = z.object({
	email: z.email(),
	password: z.string().min(6).max(50),
});

export const signUpSchema = z.object({
	name: z.string().min(3).max(50),
	email: z.email(),
	password: z.string().min(6).max(50),
});

export const signOutSchema = z.object({
	session_id: z.uuid(),
	user_id: z.uuid(),
});

export type SignInDTO = z.infer<typeof signInSchema>;
export type SignUpDTO = z.infer<typeof signUpSchema>;
export type SignOutDTO = z.infer<typeof signOutSchema>;

export type AuthDTO = SignInDTO | SignUpDTO;
