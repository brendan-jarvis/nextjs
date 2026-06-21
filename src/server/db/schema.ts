import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

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
