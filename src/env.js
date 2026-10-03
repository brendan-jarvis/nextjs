import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    // Support plain and Vercel-prefixed Supabase vars
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    // Postgres connection - prefer a direct (non-pooling) URL.
    // At least one of the following must be provided (see src/server/db/index.ts).
    DATABASE_URL: z.string().url(),
    POSTGRES_URL: z.string().url().optional(),
    POSTGRES_URL_NON_POOLING: z.string().url().optional(),
    nextjs_blog_POSTGRES_URL: z.string().url().optional(),
    nextjs_blog_POSTGRES_URL_NON_POOLING: z.string().url().optional(),
    // Auth.js. Required for sign-in. Optional here so a build without
    // OAuth credentials still produces the static site.
    AUTH_SECRET: z.string().min(1).optional(),
    AUTH_GITHUB_ID: z.string().min(1).optional(),
    AUTH_GITHUB_SECRET: z.string().min(1).optional(),
    AUTH_GOOGLE_ID: z.string().min(1).optional(),
    AUTH_GOOGLE_SECRET: z.string().min(1).optional(),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_URL:
      process.env.SUPABASE_URL ||
      process.env.nextjs_blog_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_nextjs_blog_SUPABASE_URL,
    SUPABASE_ANON_KEY:
      process.env.SUPABASE_ANON_KEY ||
      process.env.nextjs_blog_SUPABASE_ANON_KEY,
    DATABASE_URL:
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.nextjs_blog_POSTGRES_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.nextjs_blog_POSTGRES_URL_NON_POOLING,
    POSTGRES_URL:
      process.env.POSTGRES_URL || process.env.nextjs_blog_POSTGRES_URL,
    POSTGRES_URL_NON_POOLING:
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.nextjs_blog_POSTGRES_URL_NON_POOLING,
    nextjs_blog_POSTGRES_URL: process.env.nextjs_blog_POSTGRES_URL,
    nextjs_blog_POSTGRES_URL_NON_POOLING:
      process.env.nextjs_blog_POSTGRES_URL_NON_POOLING,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
