"use client";

import { useToast } from "@/app/_components/ui/use-toast";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";

export function MoreMenu({ commentId }: { commentId: number }) {
  const { toast } = useToast();

  async function deleteComment() {
    // delete the comment
    // e.g. const { error } = await api.comment.deleteComment.mutation({ id: commentId });

    //    if (error) {
    //      toast({
    //        title: "Error deleting comment.",
    //        description: error.message,
    //        variant: "destructive",
    //      });
    //    } else {
    //      toast({
    //        title: "Comment deleted.",
    //        description: "Your comment has been deleted.",
    //      });
    //
    //      // TODO: Refresh comments
    //    }
    toast({
      title: "Comment deleted.",
      description: "Your comment has been deleted.",
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal size={12} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="font-bold text-destructive hover:cursor-pointer"
          onClick={() => deleteComment()}
        >
          DELETE
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
