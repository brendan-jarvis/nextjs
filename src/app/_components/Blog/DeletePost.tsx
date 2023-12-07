"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/app/_components/ui/use-toast";
import { Trash2 } from "lucide-react";

import { api } from "~/trpc/react";
import { Button } from "@/app/_components/ui/button";

export default function DeletePost({
  authorId,
  postId,
  currentUserId,
}: {
  authorId: string;
  postId: number;
  currentUserId: string;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const deletePost = api.post.deletePostAndComments.useMutation({
    onSuccess: () => {
      router.push("/blog");
      toast({
        title: "Post deleted.",
        description: "Your post has been successfully deleted.",
      });
    },

    onError: (error) => {
      toast({
        title: "Error deleting post.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex flex-row items-center justify-center">
      {currentUserId === authorId && (
        <Button
          className="font-bold "
          variant="destructive"
          onClick={() => {
            deletePost.mutate({ postAuthorId: authorId, id: postId });
          }}
        >
          <Trash2 size={16} className="mr-2" />
          DELETE
        </Button>
      )}
    </div>
  );
}
