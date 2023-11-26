import Layout from "../../components/layout";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import { useUser } from "@supabase/auth-helpers-react";
import { remark } from "remark";
import html from "remark-html";
import { useState } from "react";

export default function Add({ session }) {
  const user = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);

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
    );

  return (
    <Layout>
      <Head>
        <title>Add a Post</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>Add a Post</h1>
        <form action="/api/add-post" method="post" autoComplete="off">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows="5"
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="text"
            id="author"
            name="author"
            defaultValue={user.id}
            rows="4"
            hidden
          />
          <div id="preview">
            <button
              type="button"
              className="button block"
              onClick={() => setPreview(!preview)}
            >
              {preview ? "Hide Preview" : "Show Preview"}
            </button>
            {preview && (
              <>
                <h1>{title}</h1>
                <p
                  dangerouslySetInnerHTML={{
                    __html: remark().use(html).processSync(content).toString(),
                  }}
                />
              </>
            )}
          </div>

          <button type="submit" className="button primary block">
            Submit
          </button>
        </form>
      </article>
    </Layout>
  );
}
