import Link from "next/link";
import { allPosts, allProjects } from "contentlayer/generated";
import { compareDesc, format } from "date-fns";

export default async function Home() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, 4);

  const projects = allProjects
    .filter((project) => project.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Brendan Jarvis
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
          Full-stack web developer with 2+ years commercial C#/.NET and JavaScript experience.
        </p>

        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground">
          Kia ora. I build and maintain production systems for the New Zealand Department of
          Corrections and New Zealand Parole Board. I work daily with AI coding agents (Claude
          Code) to accelerate investigation and remediation while rigorously validating every
          output. Career-changer with a background in science, law, and government administration.
          Active self-directed portfolio in TypeScript, React/Next.js, and Python.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Explore projects
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground"
          >
            Read writing
          </Link>
          <a
            href="https://github.com/brendan-jarvis"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground"
          >
            GitHub
          </a>
          <a
            href="https://x.com/brendanjjarvis"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground"
          >
            X / Twitter
          </a>
          <a
            href="https://linkedin.com/in/brendan-jarvis-813742106"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground"
          >
            LinkedIn
          </a>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          New Zealand-based • Eligible for Australian Special Category visa
        </p>
      </section>

      {/* What I bring (directly echoes CV) */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">What I bring</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium">Production systems in regulated environments</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Own and support the NZ Parole Board Hearing Management System (PBHS) on Microsoft
              Dynamics 365 — C# plugins, Azure Logic Apps integration to legacy systems, Cloud
              Flows, and L2/L3 incident response under real compliance obligations.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium">Responsible AI-augmented development</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Use Claude Code daily for code navigation, defect investigation, and rapid
              remediation. Every AI-generated output is reviewed and validated before it ships to
              production.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium">End-to-end ownership &amp; integration</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Full-stack work across C#/.NET (MVC, WCF, Dataverse plugins), Azure services,
              Oracle PL/SQL, and frontend (Kendo UI, React). Delivered fixes and features through
              go-live and ongoing support with tight release cadences.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium">Self-directed modern portfolio</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Active work in TypeScript, React/Next.js (this site), Python tooling, and
              interactive 3D (Three.js). Career-changer who brings structured thinking from law
              and science into engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive / Demo highlight (maps to portfolio in CV) */}
      <section className="mb-16">
        <div className="rounded-lg border bg-card p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Interactive demo</h2>
              <p className="mt-2 text-muted-foreground">
                Self-contained 3D game built with React, Three.js, and TypeScript. Real-time
                physics, collision detection, particle systems, and game state management.
                Demonstrates frontend architecture and client-side logic.
              </p>
            </div>
            <Link
              href="/asteroids"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 sm:shrink-0"
            >
              Play Asteroids →
            </Link>
          </div>
        </div>
      </section>

      {/* Recent writing */}
      <section className="mb-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Recent writing</h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            All posts →
          </Link>
        </div>

        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post._id} className="group">
                <Link href={post.slug} className="block">
                  <h3 className="text-lg font-semibold group-hover:underline">
                    {post.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <time>{format(new Date(post.date), "dd MMM yyyy")}</time>
                    {post.description && (
                      <>
                        <span>•</span>
                        <span className="line-clamp-1">{post.description}</span>
                      </>
                    )}
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <p className="text-muted-foreground">No published posts yet.</p>
          )}
        </div>
      </section>

      {/* Featured projects */}
      <section>
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Featured projects</h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            All projects →
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={project.slug}
                className="group block rounded-lg border bg-card p-6 transition hover:border-foreground/20"
              >
                <h3 className="text-lg font-semibold group-hover:underline">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
                <div className="mt-4 text-xs text-muted-foreground">
                  {format(new Date(project.date), "MMM yyyy")}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No published projects yet.</p>
        )}
      </section>
    </div>
  );
}
