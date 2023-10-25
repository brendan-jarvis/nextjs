import HomeButton from '../components/HomeButton'
import AuthButton from '../components/AuthButton'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import dayjs from 'dayjs'

export const dynamic = 'force-dynamic'

const canInitSupabaseClient = () => {
  try {
    createClient()
    return true
  } catch (e) {
    return false
  }
}

export default async function Index() {
  const isSupabaseConnected = canInitSupabaseClient()
  const supabase = createClient()
  const { data: posts } = await supabase.from('posts').select()

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <HomeButton />
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <section>
            <h2 className="font-bold text-4xl mb-4">Welcome</h2>
            <p>
              Kia ora, my name is Brendan Jarvis. I am using this website to
              learn Next.js!
            </p>
            <p>
              The front-end is hosted on Vercel and the backend is provided by
              Supabase.
            </p>
            <p>
              You can contact me on{' '}
              <Link
                className="underline"
                href="https://twitter.com/brendanjjarvis"
              >
                Twitter
              </Link>
              .
            </p>
          </section>
          <section>
            <h2 className="font-bold text-4xl mb-4">Blog</h2>
            <ul className="my-auto text-foreground">
              {posts?.map((post) => (
                <Link key={post.id} href={`blog/${post.id}`}>
                  <li className="font-light underline">
                    {post.title} -{' '}
                    {dayjs(post.created_at).format('DD MMM YYYY')}
                  </li>
                </Link>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-bold text-4xl mb-4">Projects</h2>
            <ul className="my-auto text-foreground">
              <li className="py-2">
                <Link
                  className="font-semibold"
                  href="https://svelte-brendan-jarvis.vercel.app/"
                >
                  Svelte Framework
                </Link>
                <p className="font-light text-sm">7 February 2023</p>
                <p className="font-light">
                  I had a recommendation to learn Svelte and Azure fundamentals
                  (AZ-900) at a coffee meetup. I started this website using
                  Sveltekit, hosted on Vercel, and built a HackerNews news
                  reader using the HackerNews API. Consuming this external API
                  is hampered by a N+1 query problem. I&apos;ve since returned
                  to studying the AZ-900 content.
                </p>
              </li>
              <li className="py-2">
                <Link
                  className="font-semibold"
                  href="https://nextjs-brendan-jarvis.vercel.app/projects/asteroids"
                >
                  Asteroids Game (unfinished)
                </Link>
                <p className="font-light text-sm">24 January 2023</p>
                <p className="font-light">
                  I was curious about using Three.js to build 3D computer
                  graphics in a web browser using WebGL. I started this project
                  to learn 3D graphics prompted to do so as part of an
                  (unsuccessful) job application. I&apos;ve since a lot about 3D
                  graphics and how to work with Three.js. I&apos;ll hopefully
                  come back to this project at some point. The application
                  currently uses React, Next.js,{' '}
                  <a href="https://docs.pmnd.rs/react-three-fiber/getting-started/introduction">
                    React-Three-Fiber
                  </a>{' '}
                  and <a href="https://drei.pmnd.rs/">Drei</a>. It is hosted on
                  Vercel with no backend.
                </p>
              </li>

              <li className="py-2">
                <Link
                  className="font-semibold"
                  href="https://seasoned-production.up.railway.app/"
                >
                  Seasoned
                </Link>
                <p className="font-light text-sm">21 September 2022</p>
                <p className="font-light">
                  The final group project as part of the Dev Academy course.
                  Hosted on Railway (originally on Heroku) and built with React
                  and Redux. Frequently offline due to Railway&apos;s free tier
                  limits.
                </p>
              </li>

              <li className="py-2">
                <Link
                  className="font-semibold"
                  href="https://brew.onrender.com/"
                >
                  Brew!
                </Link>
                <p className="font-light text-sm">17 September 2022</p>
                <p className="font-light">
                  A personal project started to learn front-end development with
                  React and Redux, and Supabase as a backend.
                </p>
              </li>

              <li className="py-2">
                <Link
                  className="font-semibold"
                  href="https://brendan-jarvis.github.io"
                >
                  Dev Academy Blog
                </Link>
                <p className="font-light text-sm">21 June 2022</p>
                <p className="font-light">
                  A blog built to learn HTML and CSS during Dev Academy.
                </p>
              </li>
            </ul>
          </section>
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{' '}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  )
}
