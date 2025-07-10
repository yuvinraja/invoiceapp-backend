import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string().optional(),
  JWT_SECRET: z.string(),
  PORT: z.string().transform(Number),
  FRONTEND_URL: z.string().default('http://localhost:3001'),
  ALLOWED_ORIGINS: z.string().optional(),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.format());
    process.exit(1);
  }
  return result.data;
};

export const env = parseEnv();