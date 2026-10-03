import { timingSafeEqual } from "node:crypto";
import { sql } from "drizzle-orm";

import { env } from "~/env";
import { db } from "~/server/db";

// Called daily by the Vercel cron in vercel.json so the Supabase project
// sees activity and is not paused. It runs `select 1` and returns nothing
// but `{ ok }`: no timings, rows or error details.
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };

function authorised(request: Request) {
  const secret = env.CRON_SECRET;
  // Without CRON_SECRET the route is public; it only ever returns { ok }.
  if (!secret) return true;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(request: Request) {
  if (!authorised(request)) {
    return Response.json({ ok: false }, { status: 401, headers });
  }
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true }, { headers });
  } catch {
    console.error("keep-alive: database ping failed");
    return Response.json({ ok: false }, { status: 503, headers });
  }
}
