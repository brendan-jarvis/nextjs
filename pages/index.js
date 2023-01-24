import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export async function getStaticProps() {
  let { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  return {
    props: {
      allPostsData: posts,
    },
  }
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          Welcome, my name is Brendan Jarvis. I am using this website to learn
          Next.js!
        </p>
        <p>
          The front-end is hosted on Vercel and the backend is provided by
          Supabase.
        </p>
        <p>
          You can contact me on{' '}
          <a href="https://twitter.com/brendanjjarvis">Twitter</a>.
        </p>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, created_at, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                {new Intl.DateTimeFormat('en-NZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(new Date(created_at))}
              </small>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Projects</h2>
        <ul className={utilStyles.list}>
          <li className={utilStyles.listItem}>
            <Link href="https://brendan-jarvis.github.io">
              Dev Academy Blog
            </Link>
            <br />
            <small className={utilStyles.lightText}>21 June 2022</small>
            <br />
            <small className={utilStyles.lightText}>
              A blog built to learn HTML and CSS during Dev Academy.
            </small>
          </li>
        </ul>
      </section>
    </Layout>
  )
}
