import dayjs from "dayjs";
//import AddComment from "./AddComment";

//import { api } from "~/trpc/server";

export default async function Comments({ postId }: { postId: number }) {
  //const comments = await api.comment.getAll(postId);
  // Comment type
  type Comment = {
    id: number;
    author_username: string;
    created_at: string;
    updated_at: string;
    text: string;
  };

  const comments:
    Comment[]
    = [
      {
        id: 1,
        author_username: "Brendan Jarvis",
        created_at: "2021-06-01T00:00:00.000Z",
        updated_at: "2021-06-01T00:00:00.000Z",
        text: "This is a comment.",
      },
      {
        id: 2,
        author_username: "Brendan Jarvis",
        created_at: "2021-06-01T00:00:00.000Z",
        updated_at: "2021-06-01T00:00:00.000Z",
        text: "This is another comment.",
      },
    ];


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
              {comment.author_username} -{" "}
              {dayjs(comment.created_at).format("DD MMM YYYY")}
            </p>
          </div>
          {comment.updated_at !== comment.created_at && (
            <p className="text-sm text-gray-600">
              (updated {dayjs(comment.updated_at).format("DD MMM YYYY")})
            </p>
          )}
          <p className="text-gray-800">{comment.text}</p>
        </div>
      ))}
    </div>
  );
}
