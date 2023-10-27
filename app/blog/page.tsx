import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select()
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen items-center">
      <section className="text-center">
        <h2 className="my-4 text-6xl font-bold">Blog</h2>
      </section>
      <ul className="my-auto leading-loose text-foreground">
        {posts?.map((post) => (
          <Link key={post.id} href={`blog/${post.id}`}>
            <li className="underline">
              {post.title} - {dayjs(post.created_at).format("DD MMM YYYY")}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
