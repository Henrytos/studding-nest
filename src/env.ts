import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().optional().default('file:./dev.db'),
  PORT: z.coerce.number().optional().default(3333),
  JWT_SECRET: z.string(),
});

export type Env = z.infer<typeof envSchema>;
