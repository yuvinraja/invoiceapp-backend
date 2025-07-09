import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string().optional(),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);