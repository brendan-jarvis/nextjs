"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/app/_components/ui/use-toast";
import { MoreHorizontal, Flag, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";

import { api } from "~/trpc/react";

export function MoreMenu({
  authorId,
  commentId,
  currentUserId,
}: {
  authorId: string;
  commentId: number;
  currentUserId: string;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const deleteComment = api.comment.deleteById.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Comment deleted.",
        description: "Your comment has been successfully deleted.",
      });
    },

    onError: (error) => {
      toast({
        title: "Error deleting comment.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal size={12} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {currentUserId === authorId && (
          <DropdownMenuItem
            className="font-bold text-destructive hover:cursor-pointer"
            onClick={() => {
              deleteComment.mutate({ author_id: authorId, id: commentId });
            }}
          >
            <Trash2 size={16} className="mr-2" />
            DELETE
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="font-bold hover:cursor-pointer"
          onClick={() => {
            alert(`Comment reported!`);
          }}
        >
          <Flag size={16} className="mr-2" />
          Report post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
