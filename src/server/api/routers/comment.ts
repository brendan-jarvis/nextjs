import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { comments } from "~/server/db/schema";

export const commentRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        author_id: z.number(),
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(comments).values({
        author_id: input.author_id,
        title: input.title,
        content: input.content,
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.comments.findMany({
      orderBy: (comments, { desc }) => [desc(comments.created_at)],
    });
  }),

  getAllByPostId: publicProcedure.input(
    z.object({
      post_id: z.number(),
    }),
  ).query(({ ctx, input }) => {
    return ctx.db.query.comments.findMany({
      where: { post_id: input.post_id },
      orderBy: (comments, { desc }) => [desc(comments.created_at)],
    });
  }),
});

