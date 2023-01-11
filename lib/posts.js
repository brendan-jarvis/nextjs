import { remark } from 'remark'
import html from 'remark-html'
import { supabase } from '../lib/supabaseClient'

export async function getAllPostIds() {
  const { data, error } = await supabase.from('posts').select('id')

  return data.map((post) => {
    return {
      params: {
        id: String(post.id),
      },
    }
  })
}

export async function getPostData(id) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  // Use remark to convert markdown into HTML string
  const processedContent = await remark().use(html).process(data.content)
  const contentHtml = processedContent.toString()

  // Combine the data with contentHtml
  return {
    ...data,
    contentHtml,
  }
}
