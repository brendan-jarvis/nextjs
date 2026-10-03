import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { NextRequest } from "next/server";

import { auth } from "~/server/auth";

interface CreateContextOptions {
  req?: NextRequest;
}

export const createTRPCContext = async (_opts: CreateContextOptions) => {
  const session = await auth();

  return { session };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error && error.cause.name === "ZodError"
            ? (error.cause as { issues?: unknown }).issues
            : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
