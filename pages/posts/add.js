import Layout from '../../components/layout'
import Head from 'next/head'
import utilStyles from '../../styles/utils.module.css'
import { useUser } from '@supabase/auth-helpers-react'

export default function Add({ session }) {
  const user = useUser()

  if (!user)
    return (
      <Layout>
        <Head>
          <title>Add a Post</title>
        </Head>
        <article>
          <h1 className={utilStyles.headingXl}>Add a Post</h1>
          <p>You must be signed in to add a post.</p>
        </article>
      </Layout>
    )

  return (
    <Layout>
      <Head>
        <title>Add a Post</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>Add a Post</h1>
        <form action="/api/add-post" method="post" autoComplete="off">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
          <label htmlFor="content">Content</label>
          <input type="text" id="content" name="content" />
          <input
            type="text"
            id="author"
            name="author"
            defaultValue={user.id}
            hidden
          />
          <button type="submit">Submit</button>
        </form>
      </article>
    </Layout>
  )
}
