import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";
import { comments } from "~/server/db/schema";

import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const commentRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        post_id: z.number(),
        content: z.string().min(1).max(1000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      if (!authorId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      await ctx.db.insert(comments).values({
        post_id: input.post_id,
        author_id: authorId,
        content: input.content,
      });
    }),

  getAllByPostId: publicProcedure
    .input(
      z.object({
        post_id: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.comments.findMany({
        where: eq(comments.post_id, input.post_id),
      });
    }),

  deleteById: privateProcedure
    .input(
      z.object({
        id: z.number(),
        author_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      if (!authorId || authorId !== input.author_id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      await ctx.db
        .delete(comments)
        .where(
          and(eq(comments.id, input.id), eq(comments.author_id, authorId)),
        );
    }),
});
