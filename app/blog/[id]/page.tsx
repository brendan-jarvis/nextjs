import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { Button } from "components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: { id: number } }) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from("posts")
    .select()
    .eq("id", params.id)
    .single();

  if (!post) {
    return (
      <div className="mx-auto">
        <h1 className="text-4xl font-bold py-4 text-center">Post not found</h1>
      </div>
    );
  }

  const htmlContent = await remark().use(remarkHtml).process(post.content);

  return (
    <div className="mx-auto">
      <h1 className="text-3xl bg-seafoam-green uppercase font-bold py-2 my-2 text-center">
        {post.title}
      </h1>
      <p className="text-sm text-center bg-sunny-yellow my-2 p-1">
        {dayjs(post.created_at).format("DD MMM YYYY")}
        {post.updated_at !== post.created_at &&
          ` (updated ${dayjs(post.updated_at).format("DD MMM YYYY")})`}
      </p>
      <div
        className="prose prose-stone prose-h2:bg-citrus-blaze prose-h2:text-slate-800 prose-h2:lowercase mx-auto"
        dangerouslySetInnerHTML={{ __html: String(htmlContent) }}
      />
      <div className="flex justify-center">
        <Button asChild variant="ghost">
          <Link href="/blog" className="underline font-normal">
            <ChevronLeft />
            Back to blog
          </Link>
        </Button>
      </div>
    </div>
  );
}
