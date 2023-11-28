import dayjs from "dayjs";
//import AddComment from "./AddComment";

import { api } from "~/trpc/server";
import type { comments } from "~/server/db/schema";

export default async function Comments({ post_id }: { post_id: number }) {
  const comments = await api.comment.getAllByPostId.query({ post_id: post_id });

  if (!comments) {
    return (
      <div className="mx-auto">
        <h2 className="text-xl font-bold">Comments</h2>
        <p className="text-sm text-rose-600">
          Something went wrong fetching comments!
        </p>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <h2 className="text-xl font-bold">Comments</h2>
        <p className="text-sm text-gray-600">No comments on this post yet!</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h2 className="text-xl font-bold">Comments</h2>
      {comments.map((comment) => (
        <div className="my-4 w-full" key={comment.id}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {comment.author_id} -{" "}
              {dayjs(comment.created_at).format("DD MMM YYYY")}
            </p>
            {comment.updated_at > comment.created_at && (
              <p className="text-sm text-gray-600">
                (updated {dayjs(comment.updated_at).format("DD MMM YYYY")})
              </p>
            )}
          </div>
          <p className="text-gray-800">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
