import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";

import { Mdx } from "@/app/_components/mdx-components";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/app/_components/ui/button";
// import { Icons } from "@/components/icons";
import { ChevronLeft } from "lucide-react";
import dayjs from "dayjs";

interface ProjectPageProps {
  params: {
    slug: string[];
  };
}

async function getProjectFromParams(params: { slug: string[] }) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const slug = params?.slug?.join("/");
  const project = allProjects.find((project) => project.slugAsParams === slug);

  if (!project) {
    null;
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

  // const ogUrl = new URL(`${url}/api/og`);
  // ogUrl.searchParams.set("heading", post.title);
  // ogUrl.searchParams.set("type", "Blog Post");
  // ogUrl.searchParams.set("mode", "dark");

  return {
    title: project.title,
    description: project.description,
    authors: project.authors.map((author) => ({
      name: author,
    })),
  };
}

export async function generateStaticParams(): Promise<
  ProjectPageProps["params"][]
> {
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
            Published on {dayjs(project.date).format("DD MMM YYYY")}
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
          width={720}
          height={405}
          className="my-8 rounded-md border bg-muted transition-colors"
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
