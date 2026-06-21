ALTER TABLE "comments" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "image" varchar(512);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "published" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "authors" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "content" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "image" varchar(512);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "published" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "authors" jsonb DEFAULT '[]'::jsonb NOT NULL;