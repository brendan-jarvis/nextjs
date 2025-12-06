import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";

import { Mdx } from "@/app/_components/mdx-components";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/app/_components/ui/button";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";

interface ProjectPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getProjectFromParams(params: Promise<{ slug: string[] }>) {
  const { slug } = await params;
  const slugPath = slug?.join("/");
  const project = allProjects.find((project) => project.slugAsParams === slugPath);

  if (!project) {
    return null;
  }

  return project;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectFromParams(params);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.description,
    authors: project.authors.map((author) => ({
      name: author,
    })),
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      publishedTime: project.date,
      images: project.image ? [{ url: project.image }] : [],
    },
  };
}

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.slugAsParams.split("/"),
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectFromParams(params);

  if (!project) {
    notFound();
  }

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <Link
        href="/projects"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-[-200px] top-14 hidden xl:inline-flex",
        )}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        See all projects
      </Link>
      <div>
        {project.date && (
          <time
            dateTime={project.date}
            className="block text-sm text-muted-foreground"
          >
            Published on {format(new Date(project.date), "dd MMM yyyy")}
          </time>
        )}
        <h1 className="font-heading mt-2 inline-block text-4xl leading-tight lg:text-5xl">
          {project.title}
        </h1>
      </div>
      {project.image && (
        <Image
          src={project.image}
          alt={project.title}
          height={500}
          width={500}
          className="my-8 aspect-square rounded-md border bg-muted object-cover transition-transform hover:scale-105"
          priority
        />
      )}
      <Mdx code={project.body.code} />
      <hr className="mt-12" />
      <div className="flex justify-center py-6 lg:py-10">
        <Link
          href="/projects"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          See all projects
        </Link>
      </div>
    </article>
  );
}
