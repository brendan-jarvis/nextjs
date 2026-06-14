import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/account(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  // Updated matcher: removed legacy tRPC reference (tRPC and DB removed; see PRs #8, #9)
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/api/(.*)"],
};
