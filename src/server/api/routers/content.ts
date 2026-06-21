import { eq } from "drizzle-orm";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { posts, comments, projects } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

// Simple per-user rate limiter for comments (in-memory, resets on restart).
// Good enough for a personal site. For multi-instance/prod, use Redis or Upstash.
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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  // Example using Drizzle on Supabase Postgres
  // Queries the posts table (similar to what was previously stored before migration to MDX)
  getPosts: publicProcedure.query(async () => {
    const result = await db.select().from(posts).limit(5);
    return result;
  }),

  getProjects: publicProcedure.query(async () => {
    const result = await db.select().from(projects).limit(10);
    return result;
  }),

  getPostByTitle: publicProcedure
    .input(z.object({ title: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(posts)
        .where(eq(posts.title, input.title))
        .limit(1);
      return result[0] ?? null;
    }),

  // Helper to see what the current user looks like from Clerk (for debugging)
  // Call this from the client (e.g. in browser console via tRPC or a temp button)
  getCurrentUserInfo: protectedProcedure.query(async ({ ctx }) => {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(ctx.auth.userId);
    return {
      userId: ctx.auth.userId,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      primaryEmail: user.primaryEmailAddress?.emailAddress,
      // Common nice display formats:
      // fullName || `${firstName} ${lastName?.[0]}.` || username || firstName
    };
  }),

  getCommentsForPost: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(comments)
        .where(eq(comments.postId, input.postId));
      return result;
    }),

  // Example insert (protected)
  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        content: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Simple rate limit
      const now = Date.now();
      const last = lastCommentTimestamps.get(ctx.auth.userId) ?? 0;
      if (now - last < COMMENT_RATE_LIMIT_MS) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Please wait a moment before posting another comment.",
        });
      }
      lastCommentTimestamps.set(ctx.auth.userId, now);

      // Fetch nice display name from Clerk instead of raw user ID
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(ctx.auth.userId);

      // Prefer a friendly name like "Brendan J" or "Grok X"
      // We avoid storing the raw Clerk userId for display purposes.
      const authorName =
        (user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName[0]}`
          : null) ??
        user.fullName ??
        user.username ??
        user.firstName ??
        "Anonymous";

      const [newComment] = await db
        .insert(comments)
        .values({
          postId: input.postId,
          authorId: ctx.auth.userId, // keep the ID for reference / future
          authorName,
          content: input.content,
        })
        .returning();

      return newComment;
    }),

  updateComment: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        content: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [existing] = await db
        .select()
        .from(comments)
        .where(eq(comments.id, input.id))
        .limit(1);

      if (existing?.authorId !== ctx.auth.userId) {
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

      if (existing?.authorId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own comments",
        });
      }

      await db.delete(comments).where(eq(comments.id, input.id));
      return { success: true };
    }),
});
