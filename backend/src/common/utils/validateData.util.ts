import type { ZodType, z } from "zod";

export function validateData<T extends ZodType>(data: z.infer<T>, schema: T): z.infer<T> {
	return schema.parse(data);
}
