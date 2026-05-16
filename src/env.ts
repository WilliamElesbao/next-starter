import { z } from "zod";

const envSchema = z.object({
  // Base URL
  NEXT_PUBLIC_BASE_URL: z.url(),
  // Database and Redis
  DATABASE_URL: z.url().startsWith("postgresql://"),
  REDIS_URL: z.string().startsWith("redis://"),
  // BetterAuth
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url(),
  // Google
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  // Resend
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.email(),
  EMAIL_TO: z.email(),
  AUDIENCE_ID: z.string().min(1),
  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
});

export const env = envSchema.parse(Bun.env);
