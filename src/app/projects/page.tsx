import Image from "next/image";
import Link from "next/link";
import { allProjects } from "contentlayer/generated";
import { compareDesc, format } from "date-fns";
import type { Metadata } from "next";

import { ProjectLinks } from "@/app/_components/ProjectLinks";
import { SpectrumRule } from "@/app/_components/SpectrumRule";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const projects = allProjects
    .filter((project) => project.published)
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date));
    });

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl lg:text-5xl">Projects</h1>
          <p className="text-muted-foreground">
            Work I have shipped, and what I learned from it.
          </p>
        </div>
      </div>
      <hr className="my-8 border-[#E4DCD2]" />
      {projects?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project._id}
              className="relative flex flex-col bg-card"
            >
              <div className="aspect-video overflow-hidden bg-muted">
                <Image
                  src={
                    project.image ?? "/images/projects/project_placeholder2.jpg"
                  }
                  alt={project.title}
                  width={804}
                  height={452}
                  className="h-full w-full object-cover"
                  priority={index <= 1}
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-[10px] tracking-wide text-orchid-pink">
                  PROJECT
                </p>
                <h2 className="mt-2 text-2xl">{project.title}</h2>
                {project.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
                {project.date && (
                  <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                    {format(new Date(project.date), "dd MMM yyyy").toUpperCase()}
                  </p>
                )}
                <Link href={project.slug} className="absolute inset-0">
                  <span className="sr-only">View {project.title}</span>
                </Link>
                <ProjectLinks project={project} className="relative z-10 mt-4" />
              </div>
              <SpectrumRule />
            </article>
          ))}
        </div>
      ) : (
        <p>No projects published.</p>
      )}
    </div>
  );
}
