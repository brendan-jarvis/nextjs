import Image from "next/image";
import Link from "next/link";
import { allPosts } from "contentlayer/generated";
import { compareDesc, format } from "date-fns";
import { SpectrumRule } from "@/app/_components/SpectrumRule";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
};

export default async function BlogPage() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date));
    });

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl lg:text-5xl">Writing</h1>
          <p className="text-muted-foreground">
            Notes on the work, and the occasional practical post.
          </p>
        </div>
      </div>
      <hr className="my-8 border-[#E4DCD2]" />
      {posts?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {posts.map((post, index) => (
            <article key={post._id} className="relative flex flex-col bg-card">
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.title}
                  width={804}
                  height={452}
                  className="aspect-video object-cover"
                  priority={index <= 1}
                />
              )}
              <div className="p-5">
                <p className="font-mono text-[10px] tracking-wide text-seafoam-green">
                  WRITING
                </p>
                <h2 className="mt-2 text-2xl">
                  <Link
                    href={post.slug}
                    className="underline decoration-citrus-blaze decoration-2 underline-offset-4"
                  >
                    {post.title}
                  </Link>
                </h2>
                {post.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {post.description}
                  </p>
                )}
                {post.date && (
                  <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                    {format(new Date(post.date), "dd MMM yyyy").toUpperCase()}
                  </p>
                )}
              </div>
              <SpectrumRule />
            </article>
          ))}
        </div>
      ) : (
        <p>No posts published.</p>
      )}
    </div>
  );
}
