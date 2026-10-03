# AGENTS.md

This file provides persistent instructions for AI agents (Grok Build, Claude Code, etc.).

## Project Overview

Personal blog + portfolio site. Static MDX content (blog posts, projects) via Contentlayer2, with comments and projects metadata backed by Supabase Postgres. Sign-in is Auth.js (NextAuth v5) with the GitHub and Google providers and database sessions stored in that same Postgres database. Interactive demo (asteroids game).

## Tech Stack

- **Next.js 15** (App Router, React 19)
- **Bun 1.3.14** (package manager + runtime)
- **Contentlayer2** + MDX for content
- **tRPC** (type-safe API) + **Drizzle ORM** + **postgres.js**
- **Auth.js** (next-auth v5, GitHub + Google providers, Drizzle adapter, database sessions)
- **Supabase** (Postgres)
- **Tailwind v4** + shadcn/ui
- **TypeScript** (strict)

Key files: `src/env.js` (strict env validation, supports SKIP_ENV_VALIDATION=1), `src/lib/site.ts` (canonical URL and default metadata), `next.config.js` (CSP), `contentlayer.config.js`.

## High-Level Structure

```
/
├── src/
│   ├── app/              # Next.js pages, layouts, _components (incl. Comments, UI)
│   │   ├── blog/, projects/, asteroids/  # Route groups
│   │   ├── layout.tsx, providers.tsx
│   │   └── api/trpc/
│   ├── server/           # auth/, tRPC (routers/content.ts), db (schema.ts, index.ts, seed.ts)
│   ├── trpc/             # Client provider
│   ├── env.js, lib/site.ts, styles/globals.css
├── content/              # MDX: blog/ + projects/
├── drizzle/              # Migrations (drizzle-kit)
├── public/
└── package.json, next.config.js, tailwind.config.ts, eslint.config.mjs
```

## Essential Commands

```bash
# ALWAYS work here (not worktrees) - cd if needed

bun install
cp .env.example .env            # Fill real keys

SKIP_ENV_VALIDATION=1 bun run dev     # Dev (contentlayer + next)
bun run build                         # contentlayer2 build && next build
bun run lint                          # eslint src
bun run seed                          # Seed DB from MDX + test data
bun run start
```

## Coding Standards & Conventions

- Use `~/*` or `@/*` aliases for `src/`.
- Prefer server components; client only when needed (`"use client"`).
- tRPC: `publicProcedure` for reads, `protectedProcedure` for comment writes (Auth.js session).
- DB: Server-only (Drizzle). Never client-side. Tables live in the Supabase `nextjs` schema (`pgSchema("nextjs")`). `DATABASE_URL` is the transaction pooler (port 6543), so postgres.js runs with `prepare: false`.
- Styling: Tailwind + custom colors (`--color-citrus-blaze` etc. via @theme). Recent animations use CSS vars like `--sweep-color`.
- MDX frontmatter required (title, date, published, etc.).
- Imports: Type-only imports where possible.
- Comments: owner checks use `session.user.id`. Do not add a catch-all `middleware.ts`; it would force every page to be dynamic.

## Agent Behavior Rules

- **Always** operate in main repo. Avoid `.grok/worktrees`.
- After **every** code edit: run `bun run lint`. Prefer `bun run build` too before claiming done.
- Use branches for features (`git checkout -b ...`), not worktrees.
- Never hardcode secrets. Use `env.*` or `process.env` with SKIP for builds.
- For DB/auth changes: respect the server-only model. Session tokens stay in Postgres. Do not add client-side writes.
- Prefer Bun commands. Update package.json with `"packageManager": "bun@..."` if changing.
- Keep changes minimal and focused. Update relevant docs (README) when adding features.
- Test manually via `bun run dev` (no automated test suite exists).
- When editing UI (e.g. highlights): maintain support for CSS color vars (`--sweep-color`) and hover replay patterns.

## Key Gotchas & Architecture

- Env validation is strict and runs early (in next.config.js). Use `SKIP_ENV_VALIDATION=1` frequently.
- Comments are loaded in the browser by post title. `auth()` runs on the tRPC route, not in the root layout, so pages stay static.
- Sign-in needs `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET`. Auth.js reads the provider pairs by convention.
- CSP is customized in `next.config.js`.
- `metadataBase` is `https://brendan-jarvis.vercel.app`. There is no custom domain.
- Worktrees have caused confusion historically — stick to `main` branch + git.
- No tests; rely on lint + build + manual dev verification.
- `drizzle/0000_nextjs_baseline.sql` describes tables that already exist in Supabase. Do not run `drizzle-kit migrate` or `push` against production without review.

Update this file when major stack/architecture changes occur.
