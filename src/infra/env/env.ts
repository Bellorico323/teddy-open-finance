import { z } from "zod"

export const envSchema = z.object({
	JWT_PRIVATE_KEY: z.string(),
	JWT_PUBLIC_KEY: z.string(),
	DATABASE_URL: z.string().url(),
	DB_PORT: z.string(),
	DB_PASSWORD: z.string(),
	DB_NAME: z.string(),
	DB_USER: z.string(),
	PORT: z.coerce.number().default(3000),
	API_URL: z.string().url(),
	CORS_ALLOWED_ORIGINS: z.string(),
})

export type Env = z.infer<typeof envSchema>
