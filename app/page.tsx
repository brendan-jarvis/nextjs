import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";

export default async function Index() {
  const supabase = createClient();
  const { data: posts } = await supabase.from("posts").select();

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
          <h2 className="mb-4 text-4xl font-bold text-orchid-pink">Blog</h2>
          <ul className="my-auto text-foreground">
            {posts?.map((post) => (
              <Link key={post.id} href={`blog/${post.id}`}>
                <li className="font-light underline decoration-soft-lilac">
                  {post.title} - {dayjs(post.created_at).format("DD MMM YYYY")}
                </li>
              </Link>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-4 text-4xl font-bold text-orchid-pink">Projects</h2>
          <ul className="my-auto text-foreground">
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
                href="https://nextjs-brendan-jarvis.vercel.app/projects/asteroids"
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
                href="https://seasoned-production.up.railway.app/"
              >
                Seasoned
              </Link>
              <p className="bg-sunny-yellow text-sm font-light">
                21 September 2022
              </p>
              <p className="font-light">
                The final group project as part of the Dev Academy course.
                Hosted on Railway (originally on Heroku) and built with React
                and Redux. Frequently offline due to Railway&apos;s free tier
                limits.
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

      <footer className="flex w-full justify-center border-t border-t-foreground/10 p-8 text-center text-xs">
        <p>
          Powered by{" "}
          <Link
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </Link>
        </p>
      </footer>
    </div>
  );
}
