import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    CLERK_SECRET_KEY: z.string().min(1),
    // Support plain and Vercel-prefixed Supabase vars
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    // Support standard + Vercel-prefixed Postgres connection strings from Supabase integration
    DATABASE_URL: z.string().url().optional(),
    POSTGRES_URL: z.string().url().optional(),
    POSTGRES_URL_NON_POOLING: z.string().url().optional(),
    nextjs_blog_POSTGRES_URL: z.string().url().optional(),
    nextjs_blog_POSTGRES_URL_NON_POOLING: z.string().url().optional(),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL || process.env.nextjs_blog_SUPABASE_URL || process.env.NEXT_PUBLIC_nextjs_blog_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.nextjs_blog_SUPABASE_ANON_KEY,
    DATABASE_URL: process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.nextjs_blog_POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.nextjs_blog_POSTGRES_URL_NON_POOLING,
    POSTGRES_URL: process.env.POSTGRES_URL || process.env.nextjs_blog_POSTGRES_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING || process.env.nextjs_blog_POSTGRES_URL_NON_POOLING,
    nextjs_blog_POSTGRES_URL: process.env.nextjs_blog_POSTGRES_URL,
    nextjs_blog_POSTGRES_URL_NON_POOLING: process.env.nextjs_blog_POSTGRES_URL_NON_POOLING,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
