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
  {
    title: "Production systems in regulated environments",
    paragraphs: [
      "Own and support the NZ Parole Board Hearing Management System (PBHS) on Microsoft Dynamics 365.",
      "C# plugins, Azure Logic Apps integration to legacy systems, Cloud Flows, and incident response under real compliance obligations.",
    ],
    color: "#16223B",
  },
  {
    title: "Responsible AI-augmented development",
    paragraphs: [
      "Use Claude Code daily for code navigation, defect investigation, and rapid remediation.",
      "Every AI-generated output is reviewed and validated before it ships to production.",
    ],
    color: "#EA6E4B",
  },
  {
    title: "End-to-end ownership & integration",
    paragraphs: [
      "Full-stack work across C#/.NET (MVC, WCF, Dataverse plugins), Azure services, Oracle PL/SQL, and frontend (Kendo UI, React).",
      "Delivered fixes and features through go-live and ongoing support with tight release cadences.",
    ],
    color: "#3A1E66",
  },
  {
    title: "Self-directed modern portfolio",
    paragraphs: [
      "Active work in TypeScript, React/Next.js, and Python tooling.",
      "Career-changer who brings structured thinking from law and science into engineering.",
    ],
    color: "#ABE3D2",
  },
];

const projectColors = ["#D653A9", "#EA6E4B", "#3A1E66", "#CDA8E2"];

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
      <section className="mb-16 text-center">
        <h1 className="text-5xl sm:text-6xl">Brendan Jarvis</h1>
        <p className="mt-4 font-mono text-[11px] tracking-wide text-muted-foreground">
          NEW ZEALAND · ELIGIBLE TO WORK IN AUSTRALIA
        </p>
        <p className="mt-6 font-display text-2xl italic text-citrus-blaze">Kia ora.</p>
        <p className="mx-auto mt-2 max-w-2xl text-lg">
          I am a full-stack web developer with commercial C#/.NET, Dynamics 365,
          and React experience.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          I build and maintain production systems for the New Zealand Department
          of Corrections and New Zealand Parole Board.
        </p>
        <ContactLinks className="mt-6 justify-center" />
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl">What I bring</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {bring.map((item) => (
            <article key={item.title} className="flex h-full flex-col bg-card">
              <div className="flex-1 p-6">
                <h3 className="text-lg">{item.title}</h3>
                {item.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-2 text-sm text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
              <SpectrumRule color={item.color} />
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
            {projects.map((project, index) => (
              <article key={project._id} className="relative flex h-full flex-col bg-card">
                <div className="flex flex-1 flex-col p-6">
                  <p
                    className="font-mono text-[10px] tracking-wide"
                    style={{ color: projectColors[index % projectColors.length] }}
                  >
                    PROJECT
                  </p>
                  <h3 className="mt-2 text-xl">{project.title}</h3>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {format(new Date(project.date), "MMM yyyy").toUpperCase()}
                  </p>
                  {project.description && (
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  )}
                  <Link href={project.slug} className="absolute inset-0">
                    <span className="sr-only">View {project.title}</span>
                  </Link>
                  <ProjectLinks project={project} className="relative z-10 mt-auto pt-4" />
                </div>
                <SpectrumRule color={projectColors[index % projectColors.length]!} />
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
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post._id} className="relative bg-card">
                <div className="p-6">
                  <p className="font-mono text-[10px] tracking-wide text-seafoam-green">
                    WRITING
                  </p>
                  <h3 className="mt-1 text-xl">{post.title}</h3>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {format(new Date(post.date), "dd MMM yyyy").toUpperCase()}
                    {post.description ? ` · ${post.description}` : ""}
                  </p>
                  <Link href={post.slug} className="absolute inset-0">
                    <span className="sr-only">View {post.title}</span>
                  </Link>
                </div>
                <SpectrumRule color="#ABE3D2" />
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
