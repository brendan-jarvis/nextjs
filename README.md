# Blog

A personal blog and portfolio built with Next.js 15, featuring static MDX content powered by [Contentlayer2](https://github.com/timlrx/contentlayer2).

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Content**: MDX via Contentlayer2
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Hosting**: [Vercel](https://vercel.com/)

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Clerk keys to .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── blog/           # Blog listing and posts
│   ├── projects/       # Project listing and details
│   └── _components/    # Shared React components
├── content/            # MDX content files
│   ├── blog/           # Blog posts
│   └── projects/       # Project writeups
└── lib/                # Utility functions
```

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

## License

MIT
