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

const missingMessage =
  "No Postgres connection string found. Add DATABASE_URL (recommended) or one of the POSTGRES_* vars to your .env / .env.development.local. Use the Supabase transaction pooler string (port 6543) from Dashboard > Connect.";

if (!connectionString) {
  // Production must have a database. Preview deployments deliberately do
  // not get DATABASE_URL, so they still build and serve the static pages;
  // database queries there fail at query time instead.
  if (process.env.VERCEL_ENV === "production") throw new Error(missingMessage);
  console.warn(missingMessage);
}

// DATABASE_URL should be the Supabase transaction pooler (port 6543).
// The transaction pooler does not support prepared statements.
// postgres.js connects lazily, so the placeholder is never dialled at import.
const client = postgres(
  connectionString ?? "postgres://unset@127.0.0.1:1/unset",
  {
    max: 1, // Good default when running in serverless environments
    prepare: false,
  },
);

export const db = drizzle(client, { schema });
