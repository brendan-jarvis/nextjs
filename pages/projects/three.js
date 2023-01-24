import Layout from '../../components/layout'
import Head from 'next/head'
import utilStyles from '../../styles/utils.module.css'

export default function Three({ session }) {
  return (
    <Layout>
      <Head>
        <title>Three.js</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>Three.js</h1>
        <p>Coming soon...</p>
      </article>
    </Layout>
  )
}
