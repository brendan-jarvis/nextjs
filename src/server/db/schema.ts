import {
  pgSchema,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  jsonb,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

/**
 * Every table lives in the Supabase `nextjs` schema. The tables already
 * exist there with row level security enabled and no policies, and the
 * schema is not exposed to the Data API. The definitions below match
 * the live tables exactly, so no migration is needed.
 *
 * Every table calls .enableRLS(). Without it, `drizzle-kit push` would
 * emit `ALTER TABLE ... DISABLE ROW LEVEL SECURITY` for each table.
 * `drizzle-kit push` still proposes dropping and re-adding the composite
 * primary keys on account and verificationToken (a drizzle-kit quirk; the
 * keys already match). Keep strict mode on and review statements first.
 */
export const nextjs = pgSchema("nextjs");

/**
 * Posts table - stores full blog post content from MDX.
 * Supports migrating away from Contentlayer.
 */
export const posts = nextjs
  .table(
    "posts",
    {
      id: serial("id").primaryKey(),
      authorId: varchar("author_id", { length: 64 }).notNull(),
      title: varchar("title", { length: 256 }).notNull(),
      description: text("description"),
      content: text("content").notNull(), // full MDX body
      image: varchar("image", { length: 512 }),
      published: boolean("published").default(true).notNull(),
      authors: jsonb("authors").$type<string[]>().default([]).notNull(),
      date: timestamp("date").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
      tags: varchar("tags", { length: 256 }),
    },
    // Comments look posts up by title, so titles must be unique.
    (table) => [uniqueIndex("posts_title_key").on(table.title)],
  )
  .enableRLS();

/**
 * Comments table - linked to posts.
 */
export const comments = nextjs
  .table(
    "comments",
    {
      id: serial("id").primaryKey(),
      postId: integer("post_id")
        .notNull()
        .references(() => posts.id, { onDelete: "restrict" }),
      authorId: varchar("author_id", { length: 64 }).notNull(),
      authorName: varchar("author_name", { length: 128 }),
      content: text("content").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
    },
    (table) => [index("comments_post_id_idx").on(table.postId)],
  )
  .enableRLS();

/**
 * Projects table - stores full project content from MDX.
 * Supports migrating away from Contentlayer.
 */
export const projects = nextjs
  .table("projects", {
    id: serial("id").primaryKey(),
    authorId: varchar("author_id", { length: 64 }).notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    content: text("content"), // full MDX body
    image: varchar("image", { length: 512 }),
    url: varchar("url", { length: 512 }).notNull(),
    published: boolean("published").default(true).notNull(),
    authors: jsonb("authors").$type<string[]>().default([]).notNull(),
    date: timestamp("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  })
  .enableRLS();

// Export types
export type SelectPost = typeof posts.$inferSelect;
export type SelectComment = typeof comments.$inferSelect;
export type SelectProject = typeof projects.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
export type InsertComment = typeof comments.$inferInsert;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Auth.js tables. Column property names match @auth/drizzle-adapter.
 * These hold OAuth tokens and session tokens. The app's database role
 * must own the tables or have BYPASSRLS, because RLS has no policies.
 */
export const users = nextjs.table("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = nextjs.table(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
    index("account_user_id_idx").on(account.userId),
  ],
);

export const sessions = nextjs.table(
  "session",
  {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => [index("session_user_id_idx").on(session.userId)],
);

export const verificationTokens = nextjs.table(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ],
);

// enableRLS() marks the table in place. It is called as a statement here
// because the chained form drops `enableRLS` from the type, and
// @auth/drizzle-adapter's table types require it.
users.enableRLS();
accounts.enableRLS();
sessions.enableRLS();
verificationTokens.enableRLS();
