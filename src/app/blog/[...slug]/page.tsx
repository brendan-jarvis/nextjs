import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";

import { Mdx } from "@/app/_components/mdx-components";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/app/_components/ui/button";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { Comments } from "@/app/_components/Comments";

interface PostPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getPostFromParams(params: Promise<{ slug: string[] }>) {
  const { slug } = await params;
  const slugPath = slug?.join("/");
  const post = allPosts.find((post) => post.slugAsParams === slugPath);

  if (!post) {
    return null;
  }

  return post;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    authors: post.authors.map((author) => ({
      name: author,
    })),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);

  if (!post) {
    notFound();
  }

  return (
    <article className="relative container max-w-3xl py-6 lg:py-10">
      <Link
        href="/blog"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute top-14 left-[-50] hidden xl:inline-flex",
        )}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        See all posts
      </Link>
      <div>
        {post.date && (
          <time
            dateTime={new Date(post.date).toISOString()}
            className="text-muted-foreground block text-sm"
          >
            Published on {format(new Date(post.date), "dd MMM yyyy")}
          </time>
        )}
        <h1 className="font-heading mt-2 inline-block text-4xl leading-tight lg:text-5xl">
          {post.title}
        </h1>
      </div>
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={720}
          height={405}
          className="bg-muted my-8 rounded-md border transition-colors"
          priority
        />
      )}
      <Mdx code={post.body.code} />
      <Comments postTitle={post.title} />
      <hr className="mt-12" />
      <div className="flex justify-center py-6 lg:py-10">
        <Link href="/blog" className={cn(buttonVariants({ variant: "ghost" }))}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          See all posts
        </Link>
      </div>
    </article>
  );
}
