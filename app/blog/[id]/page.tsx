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
        <h1 className="py-4 text-center text-4xl font-bold">Post not found</h1>
      </div>
    );
  }

  const htmlContent = await remark().use(remarkHtml).process(post.content);

  return (
    <div className="mx-auto">
      <h1 className="bg-seafoam-green my-2 py-2 text-center text-3xl font-bold uppercase">
        {post.title}
      </h1>
      <p className="bg-sunny-yellow my-2 p-1 text-center text-sm">
        {dayjs(post.created_at).format("DD MMM YYYY")}
        {post.updated_at !== post.created_at &&
          ` (updated ${dayjs(post.updated_at).format("DD MMM YYYY")})`}
      </p>
      <div
        className="prose prose-stone prose-h2:bg-citrus-blaze prose-h2:lowercase prose-h2:text-slate-800 mx-auto"
        dangerouslySetInnerHTML={{ __html: String(htmlContent) }}
      />
      <div className="flex justify-center">
        <Button asChild variant="ghost">
          <Link href="/blog" className="font-normal underline">
            <ChevronLeft />
            Back to blog
          </Link>
        </Button>
      </div>
    </div>
  );
}
