# AGENTS.md

This file provides persistent instructions for AI agents (Grok Build, Claude Code, etc.).

## Project Overview

Personal blog + portfolio site. Static MDX content (blog posts, projects) via Contentlayer2, with dynamic features (comments, projects metadata) backed by Supabase Postgres. Authentication via Clerk. Interactive demo (asteroids game).

## Tech Stack

- **Next.js 15** (App Router, React 19)
- **Bun 1.3.14** (package manager + runtime)
- **Contentlayer2** + MDX for content
- **tRPC** (type-safe API) + **Drizzle ORM** + **postgres.js**
- **Clerk** (auth)
- **Supabase** (Postgres)
- **Tailwind v4** + shadcn/ui
- **TypeScript** (strict)

Key files: `src/env.js` (strict env validation, supports SKIP_ENV_VALIDATION=1), `next.config.js` (CSP for Clerk/Supabase), `contentlayer.config.js`.

## High-Level Structure

```
/
├── src/
│   ├── app/              # Next.js pages, layouts, _components (incl. Comments, UI)
│   │   ├── blog/, projects/, asteroids/  # Route groups
│   │   ├── layout.tsx, providers.tsx
│   │   └── api/trpc/
│   ├── server/           # tRPC (routers/content.ts), db (schema.ts, index.ts, seed.ts)
│   ├── trpc/             # Client provider
│   ├── env.js, middleware.ts, styles/globals.css
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
- tRPC: `publicProcedure` for reads, `protectedProcedure` for writes (Clerk auth).
- DB: Server-only (Drizzle). Never client-side. Use direct (non-pooling) Postgres URL.
- Styling: Tailwind + custom colors (`--color-citrus-blaze` etc. via @theme). Recent animations use CSS vars like `--sweep-color`.
- MDX frontmatter required (title, date, published, etc.).
- Imports: Type-only imports where possible.
- Comments: Author checks enforced in tRPC (only owner can edit/delete).

## Agent Behavior Rules

- **Always** operate in main repo. Avoid `.grok/worktrees`.
- After **every** code edit: run `bun run lint`. Prefer `bun run build` too before claiming done.
- Use branches for features (`git checkout -b ...`), not worktrees.
- Never hardcode secrets. Use `env.*` or `process.env` with SKIP for builds.
- For DB/auth changes: respect server-only model, authorId checks, rate limits.
- Prefer Bun commands. Update package.json with `"packageManager": "bun@..."` if changing.
- Keep changes minimal and focused. Update relevant docs (README) when adding features.
- Test manually via `bun run dev` (no automated test suite exists).
- When editing UI (e.g. highlights): maintain support for CSS color vars (`--sweep-color`) and hover replay patterns.

## Key Gotchas & Architecture

- Env validation is strict and runs early (in next.config.js). Use `SKIP_ENV_VALIDATION=1` frequently.
- Comments use in-memory rate limit + title lookup (not ID).
- CSP is customized in `next.config.js` — changes may break Clerk flows.
- Worktrees have caused confusion historically — stick to `main` branch + git.
- No tests; rely on lint + build + manual dev verification.
- Database connection prefers non-pooling URLs for reliability.

Update this file when major stack/architecture changes occur.
