import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import dayjs from 'dayjs'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = createClient()
  const { data: posts } = await supabase.from('posts').select()

  return (
    <ul className="my-auto text-foreground">
      {posts?.map((post) => (
        <Link key={post.id} href={`blog/${post.id}`}>
          <li className="underline">
            {post.title} - {dayjs(post.created_at).format('DD MMM YYYY')}
          </li>
        </Link>
      ))}
    </ul>
  )
}
