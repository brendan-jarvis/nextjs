import dayjs from "dayjs";
import { CreateComment } from "./CreateComment";
import { MoreMenu } from "./MoreMenu";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import { api } from "~/trpc/server";
import type { Comment } from "~/server/db/schema";

async function CommentView({ comment }: { comment: Comment }) {
  const user = await clerkClient.users.getUser(comment.author_id);

  return (
    <div className="my-4 flex w-full">
      <Avatar >
        <AvatarImage src={user.imageUrl} />
        <AvatarFallback>
          {user.username ? user.username.slice(0, 1) : "??"}
        </AvatarFallback>
      </Avatar>
      <div className="ml-2 flex-grow">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {user.username ? user.username : user.firstName} -{" "}
            {dayjs(comment.created_at).format("DD MMM YYYY")}
            {comment.updated_at > comment.created_at &&
              ` (updated ${dayjs(comment.updated_at).format("DD MMM YYYY")})`}
          </p>
          <MoreMenu authorId={comment.author_id} commentId={comment.id} />
        </div>
        <p className="text-gray-800">{comment.content}</p>
      </div>
    </div>
  );
}

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
        <SignedIn>
          <CreateComment post_id={post_id} />
        </SignedIn>
        <SignedOut>
          <p className="text-sm text-gray-600">Sign in to comment!</p>
        </SignedOut>
        <p className="text-sm text-gray-600">No comments on this post yet!</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h2 className="text-xl font-bold">Comments</h2>
      <SignedIn>
        <CreateComment post_id={post_id} />
      </SignedIn>
      <SignedOut>
        <p className="text-sm text-gray-600">Sign in to comment!</p>
      </SignedOut>
      {comments.map((comment) => (
        <CommentView
          key={comment.id}
          comment={comment}
        />
      ))}
    </div>
  );
}
