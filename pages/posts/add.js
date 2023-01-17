import Layout from '../../components/layout'
import Head from 'next/head'
import utilStyles from '../../styles/utils.module.css'

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>Add a Post</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>Add a Post</h1>
      </article>
    </Layout>
  )
}
