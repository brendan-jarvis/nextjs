import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { posts, comments, projects } from "~/server/db/schema";

export const exampleRouter = createTRPCRouter({
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
    const result = await db.select().from(projects).limit(5);
    return result;
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
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [newComment] = await db
        .insert(comments)
        .values({
          postId: input.postId,
          authorId: ctx.auth.userId,
          content: input.content,
        })
        .returning();

      return newComment;
    }),
});
