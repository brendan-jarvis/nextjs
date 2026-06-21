# Blog

A personal blog and portfolio built with Next.js 15, featuring static MDX content powered by [Contentlayer2](https://github.com/timlrx/contentlayer2) and a dynamic backend using Supabase Postgres.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Content**: MDX via Contentlayer2
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **API**: [tRPC](https://trpc.io/)
- **Database**: [Supabase](https://supabase.com/) (Postgres) + [Drizzle ORM](https://orm.drizzle.team/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Hosting**: [Vercel](https://vercel.com/)

## Getting Started

```bash
# Install dependencies (uses Bun)
bun install

# Set up environment variables
cp .env.example .env
# Add your Clerk + Supabase keys (see .env.example)

# (Optional) Seed the database with MDX content + sample comments
bun run seed

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── blog/                # Blog listing and posts (with comments)
│   ├── projects/            # Project listing and details
│   ├── asteroids/           # Interactive Three.js game
│   ├── _components/         # Shared React components (incl. Comments)
│   └── api/trpc/            # tRPC endpoint
├── server/
│   ├── api/                 # tRPC router + procedures (content, auth)
│   └── db/                  # Drizzle schema, client, seed script
├── content/                  # MDX content files
│   ├── blog/                # Blog posts
│   └── projects/            # Project writeups
└── trpc/                     # tRPC client setup
```

Additional root files:

- `drizzle.config.ts` + `drizzle/` – DB migrations
- `supabase/` – Supabase CLI (link state + `supabase-rls-policies.sql` for optional RLS)

## Content

Blog posts and projects are written in MDX and stored in the `content/` directory. Contentlayer2 processes these files into type-safe JSON at build time.

To add a new post, create an MDX file in `content/blog/` with frontmatter:

```mdx
---
title: My Post Title
description: A brief description
date: 2024-01-01
published: true
authors:
  - Brendan Jarvis
---

Your content here...
```

## Database & Comments

Dynamic data (blog comments, projects metadata) is stored in Supabase Postgres and accessed via Drizzle + tRPC.

- Run `bun run seed` to populate tables from the MDX files in `content/`.
- Comments support create / edit / delete (only for your own comments, enforced server-side).
- See `src/server/db/schema.ts` and `src/server/api/routers/content.ts`.

## Security Notes

- Authentication via Clerk. Comment create/update/delete use protected tRPC procedures with server-side author checks (`authorId` from Clerk session).
- Database access is **server-only** (Drizzle + direct Postgres client). No client-side DB access.
- Optional RLS policies are in `supabase/supabase-rls-policies.sql`. Currently we rely on secret connection strings + app authorization.
- Comments are limited to 2000 chars + 3-second per-user rate limit (server-side).
- Run `bun audit` / `bun update` regularly. Some moderate vulns are in transitive deps of the build-time `contentlayer2` tool.
- Keep secrets out of git (`.env` and `.env*.local` are ignored; only `.env.example` is committed).

## License

MIT
