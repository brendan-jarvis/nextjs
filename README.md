# Blog

A personal blog and portfolio built with Next.js 15, featuring static MDX content powered by [Contentlayer2](https://github.com/timlrx/contentlayer2) and a dynamic backend using Supabase Postgres.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Content**: MDX via Contentlayer2
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: [Auth.js](https://authjs.dev/) (NextAuth v5, GitHub + Google)
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
# Add your Supabase keys and Auth.js GitHub/Google credentials (see .env.example)

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
│   ├── api/trpc/            # tRPC endpoint
│   └── api/auth/            # Auth.js route
├── server/
│   ├── auth/                # Auth.js config (GitHub, Google, Drizzle adapter)
│   ├── api/                 # tRPC router + procedures (content)
│   └── db/                  # Drizzle schema, client, seed script
├── content/                  # MDX content files
│   ├── blog/                # Blog posts
│   └── projects/            # Project writeups
└── trpc/                     # tRPC client setup
```

Additional root files:

- `drizzle.config.ts` + `drizzle/` – DB migrations

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

- Run `bun run seed` to populate tables from the MDX files in `content/`. Comments attach to a `posts` row found by title, so posting a comment fails until posts are seeded. The seed script deletes all comments, posts, and projects first.
- Comments support create / edit / delete for the signed-in author. Sign-in is GitHub or Google via Auth.js. Sessions are stored in Supabase Postgres.
- See `src/server/db/schema.ts` and `src/server/api/routers/content.ts`.

## Security Notes

- Database access is **server-only** (Drizzle + postgres.js over the Supabase transaction pooler). No client-side DB access.
- All tables live in the `nextjs` schema, which the Supabase Data API does not expose. Every table has row level security enabled with no policies, so the app's database role must own the tables or have `BYPASSRLS`.
- Sign-in is Auth.js with the GitHub and Google providers. Comment writes use a protected tRPC procedure and `session.user.id`. There is no auth middleware, so pages stay static.
- Run `bun audit` / `bun update` regularly. Some moderate vulns are in transitive deps of the build-time `contentlayer2` tool.
- Keep secrets out of git (`.env` and `.env*.local` are ignored; only `.env.example` is committed).

## License

MIT
