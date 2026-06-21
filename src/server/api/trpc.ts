import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { getAuth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 */
interface CreateContextOptions {
  req?: NextRequest;
}

export const createTRPCContext = async (opts: CreateContextOptions) => {
  const auth = opts.req ? getAuth(opts.req) : null;

  return {
    auth,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer.
 */
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

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this.
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});
