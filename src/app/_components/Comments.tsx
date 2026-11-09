"use client";

import { useState } from "react";
import { format } from "date-fns";
import { signIn, useSession } from "next-auth/react";

import { api } from "~/trpc/react";
import { Button } from "@/app/_components/ui/button";
import { toast } from "@/app/_components/ui/use-toast";

interface CommentsProps {
  postTitle: string;
}

export function Comments({ postTitle }: CommentsProps) {
  const { data: session } = useSession();
  const utils = api.useUtils();
  const { data: comments, isLoading } = api.content.getCommentsForPost.useQuery(
    { postTitle },
    { enabled: !!postTitle },
  );

  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const refresh = () =>
    utils.content.getCommentsForPost.invalidate({ postTitle });

  const createComment = api.content.createComment.useMutation({
    onSuccess: () => {
      setNewComment("");
      void refresh();
    },
    onError: (err) => {
      toast({ title: "Could not post comment", description: err.message });
    },
  });

  const updateComment = api.content.updateComment.useMutation({
    onSuccess: () => {
      setEditingId(null);
      setEditingContent("");
      void refresh();
    },
    onError: (err) => {
      toast({ title: "Could not update comment", description: err.message });
    },
  });

  const deleteComment = api.content.deleteComment.useMutation({
    onSuccess: () => {
      setPendingDeleteId(null);
      void refresh();
    },
    onError: (err) => {
      toast({ title: "Could not delete comment", description: err.message });
    },
  });

  return (
    <div className="mt-12 w-full">
      <h2 className="mb-6 bg-seafoam-green text-2xl font-semibold tracking-tight">
        Comments
      </h2>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading comments...</p>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => {
            const created = new Date(comment.createdAt);
            const updated = comment.updatedAt
              ? new Date(comment.updatedAt)
              : created;
            const isEdited = updated.getTime() !== created.getTime();
            const isOwner = session?.user.id === comment.authorId;
            const isEditing = editingId === comment.id;

            return (
              <div key={comment.id} className="rounded-lg border bg-card p-4">
                {isEditing ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      updateComment.mutate({
                        id: comment.id,
                        content: editingContent,
                      });
                    }}
                  >
                    <textarea
                      className="w-full resize-none rounded-md border bg-background p-3 text-sm focus:ring-2 focus:outline-none"
                      value={editingContent}
                      onChange={(event) =>
                        setEditingContent(event.target.value)
                      }
                      rows={3}
                      maxLength={2000}
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={
                          !editingContent.trim() || updateComment.isPending
                        }
                      >
                        Save
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
                    {comment.content}
                  </div>
                )}
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>by {comment.authorName ?? comment.authorId}</span>
                  <span>•</span>
                  <time dateTime={created.toISOString()}>
                    {format(created, "dd MMM yyyy")}
                    {isEdited && ` (edited ${format(updated, "dd MMM yyyy")})`}
                  </time>
                  {isOwner && !isEditing && (
                    <>
                      <button
                        type="button"
                        className="underline hover:text-foreground"
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditingContent(comment.content);
                          setPendingDeleteId(null);
                        }}
                      >
                        Edit
                      </button>
                      {pendingDeleteId === comment.id ? (
                        <>
                          <button
                            type="button"
                            className="underline hover:text-foreground"
                            disabled={deleteComment.isPending}
                            onClick={() =>
                              deleteComment.mutate({ id: comment.id })
                            }
                          >
                            Confirm delete
                          </button>
                          <button
                            type="button"
                            className="underline hover:text-foreground"
                            onClick={() => setPendingDeleteId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="underline hover:text-foreground"
                          onClick={() => setPendingDeleteId(comment.id)}
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      )}

      {session?.user ? (
        <form
          className="mt-6 space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            createComment.mutate({ postTitle, content: newComment });
          }}
        >
          <textarea
            className="w-full resize-none rounded-md border bg-background p-3 text-sm focus:ring-2 focus:outline-none"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            rows={3}
            maxLength={2000}
            disabled={createComment.isPending}
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Commenting as{" "}
              <span className="font-medium text-foreground">
                {session.user.name ?? session.user.email ?? "you"}
              </span>
            </p>
            <Button
              type="submit"
              size="sm"
              disabled={!newComment.trim() || createComment.isPending}
              className={
                newComment.trim() && !createComment.isPending
                  ? "bg-citrus-blaze text-white hover:bg-[#d45a3a]"
                  : ""
              }
            >
              {createComment.isPending ? "Posting..." : "Post comment"}
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          <button
            type="button"
            className="underline"
            onClick={() => void signIn()}
          >
            Sign in
          </button>{" "}
          to leave a comment.
        </p>
      )}
    </div>
  );
}
