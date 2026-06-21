"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";

import { api } from "~/trpc/react";
import { Button } from "@/app/_components/ui/button";

interface CommentsProps {
  postTitle: string;
}

export function Comments({ postTitle }: CommentsProps) {
  const { data: post, isLoading: postLoading } =
    api.content.getPostByTitle.useQuery({ title: postTitle });

  const {
    data: comments,
    isLoading: commentsLoading,
    refetch,
  } = api.content.getCommentsForPost.useQuery(
    { postId: post?.id ?? 0 },
    { enabled: !!post },
  );

  const { user, isSignedIn } = useUser();

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // For editing own comments
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  // Confirmation states for stylish UI (no alerts)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [pendingCancelEdit, setPendingCancelEdit] = useState(false);

  const createComment = api.content.createComment.useMutation({
    onSuccess: () => {
      setNewComment("");
      void refetch();
    },
    onError: (err) => {
      console.error("Failed to post comment:", err);
      alert("Failed to post comment. Please try again.");
    },
  });

  const updateComment = api.content.updateComment.useMutation({
    onSuccess: () => {
      setEditingCommentId(null);
      setEditingContent("");
      void refetch();
    },
    onError: (err) => {
      console.error("Failed to update comment:", err);
      alert("Failed to update comment. Please try again.");
    },
  });

  const deleteComment = api.content.deleteComment.useMutation({
    onSuccess: () => {
      void refetch();
    },
    onError: (err) => {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment. Please try again.");
    },
  });

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!post || !newComment.trim() || !isSignedIn) return;

    setIsSubmitting(true);
    try {
      await createComment.mutateAsync({
        postId: post.id,
        content: newComment.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
    // Auto-expand textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingContent(e.target.value);
    // Auto-expand edit textarea, no scrollbars
    if (editTextareaRef.current) {
      editTextareaRef.current.style.height = "auto";
      editTextareaRef.current.style.height = `${editTextareaRef.current.scrollHeight}px`;
    }
  };

  const startEditing = (comment: { id: number; content: string }) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
    setPendingCancelEdit(false);
    setPendingDeleteId(null);
    // Grow the edit textarea after setting value
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.style.height = "auto";
        editTextareaRef.current.style.height = `${editTextareaRef.current.scrollHeight}px`;
      }
    }, 0);
  };

  const cancelEditing = () => {
    if (
      editingContent.trim() !==
      (comments?.find((c) => c.id === editingCommentId)?.content ?? "").trim()
    ) {
      setPendingCancelEdit(true);
    } else {
      setEditingCommentId(null);
      setEditingContent("");
      setPendingCancelEdit(false);
    }
  };

  const confirmCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
    setPendingCancelEdit(false);
  };

  const saveEdit = async () => {
    if (!editingCommentId || !editingContent.trim()) return;
    void updateComment.mutateAsync({
      id: editingCommentId,
      content: editingContent.trim(),
    });
  };

  const handleDelete = (id: number) => {
    setPendingDeleteId(id);
    setPendingCancelEdit(false);
  };

  const confirmDelete = async (id: number) => {
    await deleteComment.mutateAsync({ id });
    setPendingDeleteId(null);
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  // Keyboard handlers for edit mode
  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      void saveEdit();
    }
  };

  if (!post && !postLoading) {
    return null;
  }

  return (
    <div className="mt-12 w-full">
      <h2 className="bg-seafoam-green mb-6 text-2xl font-semibold tracking-tight">
        Comments
      </h2>

      {commentsLoading ? (
        <p className="text-muted-foreground text-sm">Loading comments...</p>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isOwn = user?.id === comment.authorId;
            const isEditing = editingCommentId === comment.id;

            const created = new Date(comment.createdAt);
            const updated = comment.updatedAt
              ? new Date(comment.updatedAt)
              : created;
            const isEdited = updated.getTime() !== created.getTime();

            return (
              <div key={comment.id} className="bg-card rounded-lg border p-4">
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      ref={editTextareaRef}
                      className="bg-card focus:ring-ring w-full resize-none overflow-hidden rounded-md border p-2 text-sm focus:ring-2 focus:outline-none"
                      value={editingContent}
                      onChange={handleEditChange}
                      onKeyDown={handleEditKeyDown}
                      rows={1}
                      maxLength={2000}
                    />
                    {pendingCancelEdit ? (
                      <div className="text-sm">
                        Discard changes?
                        <div className="mt-1 flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={confirmCancelEdit}
                          >
                            Discard
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPendingCancelEdit(false)}
                          >
                            Keep editing
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={saveEdit}
                          disabled={
                            updateComment.isPending || !editingContent.trim()
                          }
                          className={
                            editingContent.trim() && !updateComment.isPending
                              ? "bg-citrus-blaze text-white hover:bg-[#d45a3a]"
                              : ""
                          }
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                          disabled={updateComment.isPending}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
                      {comment.content}
                    </div>
                    <div className="text-muted-foreground mt-2 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span>by {comment.authorName ?? comment.authorId}</span>
                        <span>•</span>
                        <time
                          dateTime={
                            isEdited
                              ? updated.toISOString()
                              : created.toISOString()
                          }
                        >
                          {format(created, "dd MMM yyyy")}
                          {isEdited &&
                            ` (edited ${format(updated, "dd MMM yyyy")})`}
                        </time>
                      </div>
                      {isOwn && !pendingDeleteId && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditing(comment)}
                            className="hover:text-foreground text-xs underline"
                            disabled={
                              updateComment.isPending || deleteComment.isPending
                            }
                          >
                            edit
                          </button>
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="hover:text-destructive text-xs underline"
                            disabled={deleteComment.isPending}
                          >
                            delete
                          </button>
                        </div>
                      )}
                      {pendingDeleteId === comment.id && (
                        <div className="text-sm">
                          Delete this comment?
                          <div className="mt-1 flex gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => confirmDelete(comment.id)}
                              disabled={deleteComment.isPending}
                            >
                              Delete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelDelete}
                              disabled={deleteComment.isPending}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No comments yet.</p>
      )}

      <SignedIn>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <textarea
            ref={textareaRef}
            className="bg-card focus:ring-ring w-full resize-none overflow-hidden rounded-md border p-3 text-sm focus:ring-2 focus:outline-none"
            placeholder="Write a comment..."
            value={newComment}
            onChange={handleCommentChange}
            rows={1}
            maxLength={2000}
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
              className={
                newComment.trim() && !isSubmitting
                  ? "bg-citrus-blaze text-white hover:bg-[#d45a3a]"
                  : ""
              }
            >
              {isSubmitting ? "Posting..." : "Post comment"}
            </Button>
          </div>
          {user && (
            <p className="text-muted-foreground text-xs">
              Commenting as{" "}
              <span className="text-foreground font-medium">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName[0]}.`
                  : (user.fullName ?? user.username ?? user.firstName ?? "you")}
              </span>
            </p>
          )}
        </form>
      </SignedIn>

      <SignedOut>
        <p className="text-muted-foreground mt-4 text-sm">
          <a href="/account" className="underline">
            Sign in
          </a>{" "}
          to leave a comment.
        </p>
      </SignedOut>
    </div>
  );
}
