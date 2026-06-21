"use client";

import { format } from "date-fns";

import { api } from "~/trpc/react";

interface CommentsProps {
  postTitle: string;
}

export function Comments({ postTitle }: CommentsProps) {
  const { data: posts } = api.example.getPosts.useQuery();
  const post = posts?.find((p) => p.title === postTitle);
  const { data: comments, isLoading } = api.example.getCommentsForPost.useQuery(
    { postId: post?.id ?? 0 },
    { enabled: !!post }
  );

  if (!post) {
    return null;
  }

  return (
    <div className="mt-12 w-full">
      <h2 className="bg-seafoam-green mb-6 text-2xl font-semibold tracking-tight">
        Comments
      </h2>

      {isLoading && (
        <p className="text-muted-foreground text-sm">Loading comments...</p>
      )}

      {comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-card rounded-lg border p-4"
            >
              <p className="text-sm leading-relaxed">{comment.content}</p>
              <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                <span>by {comment.authorId}</span>
                <span>•</span>
                <time dateTime={comment.createdAt}>
                  {format(new Date(comment.createdAt), "dd MMM yyyy")}
                </time>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && (
          <p className="text-muted-foreground text-sm">No comments yet.</p>
        )
      )}
    </div>
  );
}
