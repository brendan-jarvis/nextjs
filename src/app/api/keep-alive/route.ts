import { timingSafeEqual } from "node:crypto";
import { eq, ne } from "drizzle-orm";

import { env } from "~/env";
import { db } from "~/server/db";
import { heartbeat } from "~/server/db/schema";

// Vercel cron (see vercel.json). Each run inserts, updates, and deletes a
// row in nextjs.heartbeat so Supabase sees real database activity. The
// response is only `{ ok }`.
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };

function authorised(request: Request) {
  const secret = env.CRON_SECRET;
  // Missing secret is a rejection. Vercel sends the Bearer token only when
  // CRON_SECRET is set on the project, and the route must not be public.
  if (!secret) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(request: Request) {
  if (!authorised(request)) {
    return Response.json({ ok: false }, { status: 401, headers });
  }
  try {
    await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(heartbeat)
        .values({})
        .returning({ id: heartbeat.id });
      if (!row) throw new Error("keep-alive insert returned no row");
      await tx
        .update(heartbeat)
        .set({ touchedAt: new Date() })
        .where(eq(heartbeat.id, row.id));
      // Drop every other row, including leftovers from a failed earlier run.
      await tx.delete(heartbeat).where(ne(heartbeat.id, row.id));
    });
    return Response.json({ ok: true }, { headers });
  } catch (error) {
    console.error("keep-alive: database write failed", error);
    return Response.json({ ok: false }, { status: 503, headers });
  }
}
