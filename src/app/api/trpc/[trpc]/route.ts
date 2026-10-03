import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

/**
 * This wraps the tRPC handler and is the entry point for the `/api/trpc/*` endpoints.
 */
const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: ({ req: _ }) => createTRPCContext({ req }),
    onError({ error, path }) {
      // Log the full error (including its cause) server-side only. The client
      // gets a generic message for these (see errorFormatter in trpc.ts).
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`tRPC failed on ${path ?? "<no-path>"}:`, error);
      }
    },
  });

export { handler as GET, handler as POST };
