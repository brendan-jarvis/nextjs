import { createClient } from '@/utils/supabase/server'
import dayjs from 'dayjs'
import remarkHtml from 'remark-html'

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: { id: number } }) {
  const supabase = createClient()
  const { data: post } = await supabase
    .from('posts')
    .select()
    .eq('id', params.id)
    .single()

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className="text-foreground">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <p className="text-sm">
        Written {dayjs(post.created_at).format('DD MMM YYYY')}
      </p>
      <p className="prose">{post.content}</p>
      <p>-----------------------------</p>
      <h2 className="text-2xl font-bold">Debug</h2>
      <pre className="p-4 overflow-auto whitespace-pre-wrap">
        {JSON.stringify(post, null, 2)}
      </pre>
    </div>
  )
}
