import Link from "next/link";
import { allPosts, allProjects } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import dayjs from "dayjs";

export default async function Home() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date));
    });

  const projects = allProjects
    .filter((project) => project.published)
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date));
    });

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      <div className="flex max-w-4xl flex-1 flex-col gap-20 px-3">
        <section className="text-center">
          <h2 className="my-4 text-center text-6xl font-bold">Welcome</h2>
          <p className="mb-2">
            <span className="bg-citrus-blaze p-1 text-slate-100">
              Kia ora, my name is Brendan Jarvis.
            </span>
          </p>
          <p className="mb-2">
            I am using this website to learn Next.js! The front-end is hosted on
            Vercel and the backend is provided by Supabase.
          </p>
          <p>
            You can contact me on{" "}
            <Link className="underline" href="https://x.com/brendanjjarvis">
              X
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="mb-4 text-4xl font-bold">Blog</h2>
          <ul className="my-auto text-foreground">
            {posts?.map((post, index) => (
              <Link key={index} href={post.slug}>
                <li className="font-light underline decoration-soft-lilac">
                  {post.title} - {dayjs(post.date).format("DD MMM YYYY")}
                </li>
              </Link>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-4 text-4xl font-bold">Projects</h2>
          <ul className="my-auto text-foreground">
            {projects?.map((project, index) => (
              <li key={index} className="py-2">
                <Link
                  className="bg-seafoam-green font-semibold text-gray-700"
                  href={project.slug}
                >
                  {project.title}
                </Link>
                <p className="bg-sunny-yellow text-sm font-light">
                  {dayjs(project.date).format("DD MMM YYYY")}
                </p>
                <p className="font-light">{project.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
