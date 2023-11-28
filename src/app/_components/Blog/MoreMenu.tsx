"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/app/_components/ui/use-toast";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";

import { api } from "~/trpc/react";

export function MoreMenu({ commentId }: { commentId: number }) {
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
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal size={12} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="font-bold text-destructive hover:cursor-pointer"
          onClick={() => {
            deleteComment.mutate({ id: commentId });
          }}
        >
          DELETE
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
