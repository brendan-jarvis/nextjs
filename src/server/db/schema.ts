import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  jsonb,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

/**
 * Posts table - stores full blog post content from MDX.
 * Supports migrating away from Contentlayer.
 */
export const posts = pgTable("posts", {
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
});

/**
 * Comments table - linked to posts.
 */
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  authorId: varchar("author_id", { length: 64 }).notNull(),
  authorName: varchar("author_name", { length: 128 }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/**
 * Projects table - stores full project content from MDX.
 * Supports migrating away from Contentlayer.
 */
export const projects = pgTable("projects", {
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
});

// Export types
export type SelectPost = typeof posts.$inferSelect;
export type SelectComment = typeof comments.$inferSelect;
export type SelectProject = typeof projects.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
export type InsertComment = typeof comments.$inferInsert;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Auth.js tables. Column property names match @auth/drizzle-adapter.
 * These hold OAuth tokens and session tokens. RLS is enabled with no
 * policies so the Data API cannot read them. The app connects as the
 * table owner, which bypasses RLS.
 */
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
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

export const sessions = pgTable(
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

export const verificationTokens = pgTable(
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
