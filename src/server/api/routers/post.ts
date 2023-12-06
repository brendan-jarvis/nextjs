import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
import { comments } from "~/server/db/schema";

import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        author_id: z.string().min(1).max(64),
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        author_id: input.author_id,
        title: input.title,
        content: input.content,
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.created_at)],
    });
  }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.created_at)],
    });
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });
    }),

  /**
   * Planetscale doesn't support FOREIGN KEY constraints,
   * so we need to handle this functionality in the application layer
   */
  deletePostAndComments: privateProcedure
    .input(
      z.object({
        id: z.number(),
        postAuthorId: z.string().min(1).max(64),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      if (!authorId || authorId !== input.postAuthorId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      await ctx.db.delete(posts).where(eq(posts.id, input.id));
      await ctx.db.delete(comments).where(eq(comments.post_id, input.id));
    }),
});
