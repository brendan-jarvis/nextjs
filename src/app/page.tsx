import Link from "next/link";
import dayjs from "dayjs";

import { api } from "~/trpc/server";

export const revalidate = 3600;

export default async function Home() {
  const posts = await api.post.getAll.query();

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
            {posts?.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <li className="decoration-soft-lilac font-light underline">
                  {post.title} - {dayjs(post.created_at).format("DD MMM YYYY")}
                </li>
              </Link>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-4 text-4xl font-bold">Projects</h2>
          <ul className="my-auto text-foreground">
            <li className="py-2">
              <Link
                className="bg-seafoam-green font-semibold text-gray-700"
                href="https://seasoned-tau.vercel.app/"
              >
                Seasoned (T3 Stack)
              </Link>
              <p className="bg-sunny-yellow text-sm font-light">1 May 2023</p>
              <p className="font-light">
                I rebuilt this project to learn the T3 stack (TypeScript,
                Tailwind, TRPC, and Prisma). It also used the unstyled component
                library of{" "}
                <Link
                  className="underline"
                  href="https://ui.shadcn.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  shadcn/ui
                </Link>
                . I also used this project to improve my skills with Python. The
                data was collected, cleaned, and stored in a database using
                BeautifulSoup, Pandas, and Python scripts.
              </p>
            </li>
            <li className="py-2">
              <Link
                className="bg-seafoam-green font-semibold text-gray-700"
                href="https://svelte-brendan-jarvis.vercel.app/"
              >
                Svelte Framework
              </Link>
              <p className="bg-sunny-yellow text-sm font-light">
                7 February 2023
              </p>
              <p className="font-light">
                I had a recommendation to learn Svelte and Azure fundamentals
                (AZ-900) at a meetup. I started this website using Sveltekit,
                hosted on Vercel, and built a HackerNews news reader using the
                HackerNews API. Consuming this external API is hampered by a N+1
                query problem.
              </p>
            </li>
            <li className="py-2">
              <Link
                className="bg-seafoam-green font-semibold text-gray-700"
                href="https://github.com/brendan-jarvis/nextjs/blob/main/app/projects/asteroids.js"
              >
                Three.js Asteroids Game
              </Link>
              <p className="bg-sunny-yellow text-sm font-light">
                24 January 2023
              </p>
              <p className="font-light">
                I was curious about using Three.js to build 3D computer graphics
                in a web browser using WebGL. I started this project to learn 3D
                graphics prompted to do so as part of a job application.
                I&apos;ve since a lot about 3D graphics and how to work with
                Three.js. I&apos;ll hopefully come back to this project at some
                point. The application currently uses React, Next.js,{" "}
                <Link href="https://docs.pmnd.rs/react-three-fiber/getting-started/introduction">
                  React-Three-Fiber
                </Link>{" "}
                and <Link href="https://drei.pmnd.rs/">Drei</Link>.
              </p>
            </li>

            <li className="py-2">
              <Link
                className="bg-seafoam-green font-semibold text-gray-700"
                href="https://seasoned-tau.vercel.app/"
              >
                Seasoned
              </Link>
              <p className="bg-sunny-yellow text-sm font-light">
                21 September 2022
              </p>
              <p className="font-light">
                The final group project as part of the Dev Academy course.
                Hosted on Railway (originally on Heroku) and built with React
                and Redux. No longer hosted online as I have rebuilt it in a
                different stack.
              </p>
            </li>

            <li className="py-2">
              <Link
                className="bg-seafoam-green font-semibold text-gray-700"
                href="https://brew.onrender.com/"
              >
                Brew!
              </Link>
              <p className="bg-sunny-yellow text-sm font-light">
                17 September 2022
              </p>
              <p className="font-light">
                A personal project started to learn front-end development with
                React and Redux, and Supabase as a backend.
              </p>
            </li>

            <li className="py-2">
              <Link
                className="bg-seafoam-green font-semibold text-gray-700"
                href="https://brendan-jarvis.github.io"
              >
                Dev Academy Blog
              </Link>
              <p className="bg-sunny-yellow text-sm font-light">21 June 2022</p>
              <p className="font-light">
                A blog built to learn HTML and CSS during Dev Academy.
              </p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
