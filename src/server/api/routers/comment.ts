import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { comments } from "~/server/db/schema";

import { eq } from 'drizzle-orm';

export const commentRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        post_id: z.number(),
        author_id: z.number(),
        content: z.string().min(1).max(1000),
      })

    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(comments).values({
        post_id: input.post_id,
        author_id: input.author_id,
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
        where: eq(comments.post_id, input.post_id)
      });
    }),

  deleteById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(comments).where(eq(comments.id, input.id));
    }),

}); 
