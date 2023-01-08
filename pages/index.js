import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'

export default function Home() {
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
          You can contact me on{' '}
          <a href="https://twitter.com/brendanjjarvis">Twitter</a>.
        </p>
      </section>
    </Layout>
  )
}
