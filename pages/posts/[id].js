import Layout from '../../components/layout'
import Head from 'next/head'
import { getAllPostIds, getPostData } from '../../lib/posts'
import utilStyles from '../../styles/utils.module.css'

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)

  return {
    props: {
      postData,
    },
  }
}

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          {new Intl.DateTimeFormat('en-NZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date(postData.created_at))}
        </div>
        {postData.updated_at != postData.created_at && (
          <div className={utilStyles.lightText}>
            {new Intl.DateTimeFormat('en-NZ', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(new Date(postData.updated_at))}
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = await getAllPostIds()

  return {
    paths,
    fallback: false,
  }
}
