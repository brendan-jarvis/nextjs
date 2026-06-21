import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

// Support standard DATABASE_URL and Vercel/Supabase integration prefixed vars.
// Prefer non-pooling direct connection where possible (better for schema changes and certain workloads).
const connectionString =
  env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.nextjs_blog_POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.nextjs_blog_POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.nextjs_blog_POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error(
    "No Postgres connection string found. Add DATABASE_URL (recommended) or one of the POSTGRES_* vars to your .env / .env.development.local. Get the direct connection string from Supabase Dashboard > Database > Connection string."
  );
}

const client = postgres(connectionString, {
  max: 1, // Good default when running in serverless environments
});

export const db = drizzle(client, { schema });
