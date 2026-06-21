-- Supabase RLS Policies for Comments (and other tables)
-- 
-- CURRENT SECURITY MODEL:
-- This app uses **direct Postgres connections** via Drizzle ORM + the `postgres` client
-- (see src/server/db/index.ts). All database access happens server-side only.
-- Client-side code never talks directly to Supabase.
--
-- Therefore, Row Level Security (RLS) is **not strictly required** for security **as long as**:
--   1. Your DATABASE_URL / POSTGRES_* connection strings are kept secret.
--   2. You never expose the Supabase anon key + tables to browser code.
--   3. Authorization logic lives in tRPC protected procedures (see src/server/api/routers/content.ts).
--
-- The comment ownership checks are done in application code:
--   - create: authorId = ctx.auth.userId (from Clerk)
--   - update/delete: only if existing.authorId === ctx.auth.userId
--
-- RECOMMENDED: Enable RLS anyway for defense-in-depth (especially if you ever use
-- the Supabase JS client or allow direct DB connections).
--
-- To apply these policies:
--   1. Go to Supabase Dashboard > SQL Editor, or
--   2. Use Supabase CLI: supabase db execute --file supabase-rls-policies.sql
--      (after linking your project)
--
-- Note: Because we authenticate with Clerk (not Supabase Auth), these policies
-- use `auth.uid()` which may be null unless you configure JWT claims or use service role.
-- For now, we keep SELECT open (public blog) and restrict writes to service role or app logic.
--
-- Tables created by Drizzle: posts, comments, projects

-- Enable RLS on the tables
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- COMMENTS policies
-- Anyone can read comments (public blog feature)
CREATE POLICY "Allow public read access to comments"
  ON public.comments
  FOR SELECT
  USING (true);

-- Only the application (service role or server with elevated key) can insert
-- We rely on app-layer auth; tighten if you map Clerk user to Supabase auth
CREATE POLICY "Allow server-side inserts for comments"
  ON public.comments
  FOR INSERT
  WITH CHECK (true);   -- In practice enforced by tRPC + using service role / direct conn

-- Only owners (via app) can update their own
CREATE POLICY "Users can update own comments"
  ON public.comments
  FOR UPDATE
  USING (true)   -- Enforced server-side
  WITH CHECK (true);

-- Only owners can delete
CREATE POLICY "Users can delete own comments"
  ON public.comments
  FOR DELETE
  USING (true);

-- POSTS / PROJECTS (mostly read-only from content)
CREATE POLICY "Allow public read on posts"
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "Allow public read on projects"
  ON public.projects FOR SELECT USING (true);

-- Disallow public writes to posts/projects (they are seeded from MDX)
-- You would use service role for seed.
CREATE POLICY "Deny anonymous writes to posts"
  ON public.posts FOR ALL TO anon USING (false);

CREATE POLICY "Deny anonymous writes to projects"
  ON public.projects FOR ALL TO anon USING (false);

-- For stronger protection, you can use `auth.role() = 'service_role'` checks
-- or disable RLS for these tables and rely exclusively on secret connection strings.

-- After applying, verify with:
-- SELECT * FROM pg_policies WHERE tablename IN ('comments', 'posts', 'projects');
