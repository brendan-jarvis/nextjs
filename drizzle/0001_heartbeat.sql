-- Apply in the Supabase SQL editor (runs as postgres). Deploy does not
-- run migrations. Do not use `drizzle-kit migrate`: 0000 recreates tables
-- that already exist.
-- nextjs_app has BYPASSRLS, but it still needs grants. Table default
-- privileges would cover DML; sequences have none, so both grants are
-- stated here.
CREATE TABLE "nextjs"."heartbeat" (
	"id" serial PRIMARY KEY NOT NULL,
	"touched_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "nextjs"."heartbeat" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "nextjs"."heartbeat" TO nextjs_app;
--> statement-breakpoint
GRANT USAGE, SELECT ON SEQUENCE "nextjs"."heartbeat_id_seq" TO nextjs_app;
