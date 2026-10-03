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

/**
 * Only local development (`next dev`, not on a Vercel preview or production)
 * may send internal error details (messages, stacks) to the client.
 */
export const exposeInternalErrors =
  process.env.NODE_ENV === "development" &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "development");

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  // Stacks are only added to error responses when isDev is true.
  isDev: exposeInternalErrors,
  errorFormatter({ shape, error }) {
    // Unexpected errors (e.g. a failed database query) can carry SQL text or
    // other internals in their message. Replace it with a generic message;
    // the full error is logged server-side by onError in the route handler.
    // Expected errors (BAD_REQUEST with zod issues, UNAUTHORIZED, FORBIDDEN,
    // NOT_FOUND, TOO_MANY_REQUESTS) keep their messages.
    const hide =
      !exposeInternalErrors && error.code === "INTERNAL_SERVER_ERROR";
    return {
      ...shape,
      message: hide ? "Internal server error" : shape.message,
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
