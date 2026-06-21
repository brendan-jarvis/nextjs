CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" varchar(64) NOT NULL,
	"title" varchar(256),
	"description" text,
	"url" varchar(512),
	"date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
