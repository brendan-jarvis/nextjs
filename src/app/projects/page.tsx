import Image from "next/image";
import Link from "next/link";
import { allProjects } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import dayjs from "dayjs";

export const metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const projects = allProjects
    .filter((project) => project.published)
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date));
    });

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="font-heading inline-block text-4xl tracking-tight lg:text-5xl">
            Projects
          </h1>
          <p className="text-xl text-muted-foreground">
            Projects I've worked on and what I've learned from them.
          </p>
        </div>
      </div>
      <hr className="my-8" />
      {projects?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project._id}
              className="group relative flex flex-col space-y-2"
            >
              {project.image && (
                <Image
                  src={project.image}
                  alt={project.title}
                  width={804}
                  height={452}
                  className="aspect-square rounded-md border bg-muted object-cover transition-colors"
                  priority={index <= 1}
                />
              )}
              <h2 className="text-2xl font-extrabold">{project.title}</h2>
              {project.description && (
                <p className="text-muted-foreground">{project.description}</p>
              )}
              {project.date && (
                <p className="text-sm text-muted-foreground">
                  {dayjs(project.date).format("DD MMM YYYY")}
                </p>
              )}
              <Link href={project.slug} className="absolute inset-0">
                <span className="sr-only">View Article</span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p>No projects published.</p>
      )}
    </div>
  );
}
