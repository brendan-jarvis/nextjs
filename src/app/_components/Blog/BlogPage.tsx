import dayjs from "dayjs";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { Badge } from "@/app/_components/ui/badge";
import Comments from "@/app/_components/Blog/Comments";
import DeletePost from "@/app/_components/Blog/DeletePost";

import { api } from "~/trpc/server";
import { currentUser } from "@clerk/nextjs";

export const revalidate = 3600;

export async function generateMetadata({
  id,
}: {
  id: number;
}): Promise<Metadata> {
  const post = await api.post.getById.query({ id: id });

  return {
    title: post?.title + " - Brendan Jarvis",
    description:
      "Brendan Jarvis's blog about software development, motorcyling, and other things.",
    authors: [{ name: "Brendan Jarvis", url: "https://x.com/brendanjjarvis" }],
  };
}

export async function generateStaticParams() {
  const posts = await api.post.getAll.query();

  return posts?.map(({ id }) => ({
    id,
  }));
}

export default async function Blog({ id }: { id: number }) {
  const post = await api.post.getById.query({ id: id });
  const user = await currentUser();

  if (!post) {
    return (
      <div className="mx-auto">
        <h1 className="py-4 text-center text-4xl font-bold">Post not found</h1>
      </div>
    );
  }

  let htmlContent;
  if (post.content !== null) {
    htmlContent = await remark().use(remarkHtml).process(post.content);
  } else {
    // Handle the case when post.content is null
    // For example, assign a default value or skip the processing
    htmlContent = await remark().use(remarkHtml).process("No content");
  }

  return (
    <div className="mx-auto min-h-screen min-w-full bg-background p-4">
      <h1 className="my-2 bg-seafoam-green py-2 text-center text-3xl font-bold uppercase">
        {post.title}
      </h1>
      {user?.id && (
        <DeletePost
          postId={id}
          authorId={post.author_id}
          currentUserId={user.id}
        />
      )}
      <p className="my-2 bg-sunny-yellow p-1 text-center text-sm">
        {dayjs(post.created_at).format("DD MMM YYYY")}
        {post.updated_at > post.created_at &&
          ` (updated ${dayjs(post.updated_at).format("DD MMM YYYY")})`}
      </p>
      <div className="flex justify-center">
        {post?.tags?.split(", ").map((tag: string) => (
          <Badge key={tag} className="mx-1 bg-soft-lilac">
            {tag}
          </Badge>
        ))}
      </div>
      <div
        className="prose prose-stone mx-auto py-2 prose-h2:bg-citrus-blaze prose-h2:lowercase prose-h2:text-slate-800"
        dangerouslySetInnerHTML={{ __html: String(htmlContent) }}
      />
      <div className="mt-8 flex justify-center">
        <Button asChild variant="ghost">
          <Link href="/blog" className="font-normal underline">
            <ChevronLeft />
            Back to blog
          </Link>
        </Button>
      </div>
      <div className="mt-8 flex justify-center">
        <Comments post_id={id} />
      </div>
    </div>
  );
}
