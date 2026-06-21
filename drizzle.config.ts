import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: [".env.development.local", ".env"] });

const getDatabaseUrl = () => {
  // Prefer direct (non-pooling) connection for schema operations and reliability
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.nextjs_blog_POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.nextjs_blog_POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.nextjs_blog_POSTGRES_PRISMA_URL
  );
};

const url = getDatabaseUrl();
if (!url) {
  throw new Error(
    "No database connection string found. Add DATABASE_URL (or POSTGRES_URL_NON_POOLING etc.) to .env or .env.development.local. Get it from your Supabase dashboard.",
  );
}

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
  verbose: true,
  strict: true,
});
