import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Head from 'next/head'

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>404 - page not found</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>404 - page not found!</h1>
      </article>
    </Layout>
  )
}
