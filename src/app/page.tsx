import Link from "next/link";
import type { Metadata } from "next";
import { allPosts, allProjects } from "contentlayer/generated";
import { compareDesc, format } from "date-fns";

import { siteDescription, siteName, siteUrl } from "@/lib/site";
import { ContactLinks } from "@/app/_components/ContactLinks";
import { ProjectLinks } from "@/app/_components/ProjectLinks";
import { SpectrumRule } from "@/app/_components/SpectrumRule";

export const metadata: Metadata = {
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    images: [
      {
        url: "/images/profile.jpg",
        width: 400,
        height: 400,
        alt: "Brendan Jarvis",
      },
    ],
  },
};

const bring = [
  [
    "Production systems",
    "Own and support the NZ Parole Board Hearing Management System (PBHS) on Microsoft Dynamics 365. C# plugins, Azure Logic Apps, Cloud Flows, and L2/L3 response.",
  ],
  [
    "Reviewed AI output",
    "Claude Code for navigation, defect investigation, and remediation. Every generated output is reviewed before it ships.",
  ],
  [
    "End-to-end ownership",
    "C#/.NET, Dataverse plugins, Azure, Oracle PL/SQL, and React. Fixes and features through go-live and support.",
  ],
  [
    "Law and science, then engineering",
    "Active work in TypeScript, React/Next.js, and Python tooling. Structured thinking carried across from law and chemistry.",
  ],
];

export default async function Home() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, 4);

  const projects = allProjects
    .filter((project) => project.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <section className="mb-16">
        <h1 className="text-5xl sm:text-6xl">Brendan Jarvis</h1>
        <p className="mt-4 font-mono text-[11px] tracking-wide text-muted-foreground">
          NEW ZEALAND · ELIGIBLE TO WORK IN AUSTRALIA
        </p>
        <p className="mt-6 font-display text-2xl italic text-citrus-blaze">Kia ora.</p>
        <p className="mt-2 max-w-2xl text-lg">I build and maintain production systems.</p>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Hearing management for the New Zealand Parole Board, on Dynamics 365.
          Commercial C#/.NET and React.
        </p>
        <ContactLinks className="mt-6" />
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl">What I bring</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {bring.map(([title, body]) => (
            <article key={title} className="flex flex-col bg-card">
              <div className="p-6">
                <h3 className="text-lg">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
              <SpectrumRule />
            </article>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl">Featured projects</h2>
          <Link
            href="/projects"
            className="text-sm font-medium underline decoration-citrus-blaze decoration-2 underline-offset-4"
          >
            All projects
          </Link>
        </div>
        {projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <article key={project._id} className="flex flex-col bg-card">
                <div className="p-6">
                  <p className="font-mono text-[10px] tracking-wide text-orchid-pink">
                    PROJECT
                  </p>
                  <h3 className="mt-2 text-xl">
                    <Link href={project.slug}>{project.title}</Link>
                  </h3>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {format(new Date(project.date), "MMM yyyy").toUpperCase()}
                  </p>
                  {project.description && (
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  )}
                  <ProjectLinks project={project} className="mt-4" />
                </div>
                <SpectrumRule />
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No published projects yet.</p>
        )}
      </section>

      <section>
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl">Recent writing</h2>
          <Link
            href="/blog"
            className="text-sm font-medium underline decoration-citrus-blaze decoration-2 underline-offset-4"
          >
            All posts
          </Link>
        </div>
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post._id}>
                <p className="font-mono text-[10px] tracking-wide text-seafoam-green">
                  WRITING
                </p>
                <h3 className="mt-1 text-xl">
                  <Link
                    href={post.slug}
                    className="underline decoration-citrus-blaze decoration-2 underline-offset-4"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {format(new Date(post.date), "dd MMM yyyy").toUpperCase()}
                  {post.description ? ` · ${post.description}` : ""}
                </p>
              </article>
            ))
          ) : (
            <p className="text-muted-foreground">No published posts yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
