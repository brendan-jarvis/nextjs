CREATE SCHEMA "nextjs";
--> statement-breakpoint
CREATE TABLE "nextjs"."account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "nextjs"."comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"author_id" varchar(64) NOT NULL,
	"author_name" varchar(128),
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nextjs"."posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" varchar(64) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"image" varchar(512),
	"published" boolean DEFAULT true NOT NULL,
	"authors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"tags" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "nextjs"."projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" varchar(64) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"content" text,
	"image" varchar(512),
	"url" varchar(512) NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"authors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nextjs"."session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nextjs"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "nextjs"."verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "nextjs"."account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "nextjs"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nextjs"."session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "nextjs"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "nextjs"."account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "nextjs"."session" USING btree ("userId");