import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

// Support standard DATABASE_URL and Vercel/Supabase integration prefixed vars.
const connectionString =
  env.DATABASE_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.nextjs_blog_POSTGRES_URL_NON_POOLING ??
  process.env.POSTGRES_URL ??
  process.env.nextjs_blog_POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.nextjs_blog_POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error(
    "No Postgres connection string found. Add DATABASE_URL (recommended) or one of the POSTGRES_* vars to your .env / .env.development.local. Use the Supabase transaction pooler string (port 6543) from Dashboard > Connect.",
  );
}

// DATABASE_URL should be the Supabase transaction pooler (port 6543).
// The transaction pooler does not support prepared statements.
const client = postgres(connectionString, {
  max: 1, // Good default when running in serverless environments
  prepare: false,
});

export const db = drizzle(client, { schema });
