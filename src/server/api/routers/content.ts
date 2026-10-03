import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { posts, comments, projects } from "~/server/db/schema";

const COMMENT_RATE_LIMIT_MS = 3000;
const lastCommentTimestamps = new Map<string, number>();

export const contentRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getPosts: publicProcedure.query(async () => {
    const result = await db.select().from(posts).limit(5);
    return result;
  }),

  getProjects: publicProcedure.query(async () => {
    const result = await db.select().from(projects).limit(10);
    return result;
  }),

  getCommentsForPost: publicProcedure
    .input(z.object({ postTitle: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select({ comment: comments })
        .from(comments)
        .innerJoin(posts, eq(comments.postId, posts.id))
        .where(eq(posts.title, input.postTitle));
      return result.map((r) => r.comment);
    }),

  createComment: protectedProcedure
    .input(
      z.object({
        postTitle: z.string().min(1),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const now = Date.now();
      const last = lastCommentTimestamps.get(userId) ?? 0;
      if (now - last < COMMENT_RATE_LIMIT_MS) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Please wait a moment before commenting again",
        });
      }
      lastCommentTimestamps.set(userId, now);

      const [post] = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.title, input.postTitle))
        .limit(1);

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const [created] = await db
        .insert(comments)
        .values({
          postId: post.id,
          authorId: userId,
          authorName: ctx.session.user.name ?? ctx.session.user.email,
          content: input.content,
        })
        .returning();

      return created;
    }),

  updateComment: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [existing] = await db
        .select()
        .from(comments)
        .where(eq(comments.id, input.id))
        .limit(1);

      if (existing?.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only edit your own comments",
        });
      }

      const [updated] = await db
        .update(comments)
        .set({
          content: input.content,
          updatedAt: new Date(),
        })
        .where(eq(comments.id, input.id))
        .returning();

      return updated;
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const [existing] = await db
        .select()
        .from(comments)
        .where(eq(comments.id, input.id))
        .limit(1);

      if (existing?.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own comments",
        });
      }

      await db.delete(comments).where(eq(comments.id, input.id));
      return { success: true };
    }),
});
