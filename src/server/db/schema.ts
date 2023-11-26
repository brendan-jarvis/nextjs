// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  int,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `blog_${name}`);

export const posts = mysqlTable(
  "post",
  {
    id: int("id")
      .primaryKey()
      .autoincrement(),
    author_id: int("author_id").notNull(),
    title: varchar("name", { length: 256 }),
    content: varchar("content", { length: 4000 }),
    created_at: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow()
      .notNull(),
    tags: varchar("tags", { length: 256 }),
  },
  (example) => ({
    titleIndex: index("title_idx").on(example.title),
  }),
);

export const comments = mysqlTable(
  "comment",
  {
    id: int("id")
      .primaryKey()
      .autoincrement(),
    post_id: int("post_id")
      .notNull(),
    author_id: int("author_id").notNull(),
    content: varchar("content", { length: 500 }),
    created_at: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow()
      .notNull(),
  },
  (example) => ({
    contentIndex: index("author_id_idx").on(example.author_id),
  }),
);

export const profiles = mysqlTable(
  "profile",
  {
    id: int("id")
      .primaryKey()
      .autoincrement(),
    username: varchar("username", { length: 256 })
      .unique(),
    avatar_url: varchar("avatar_url", { length: 256 }),
  },
  (example) => ({
    usernameIndex: index("username_idx").on(example.username),
  }),
);
