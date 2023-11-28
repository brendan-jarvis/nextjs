"use client";

import { useRouter } from "next/navigation";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/app/_components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/_components/ui/form";
import { Textarea } from "@/app/_components/ui/textarea";
import { Button } from "@/app/_components/ui/button";

import { api } from "~/trpc/react";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  text: z.string().min(3, "Comment must be at least 3 characters long"),
});

export function CreateComment({ post_id }: { post_id: number }) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "Anonymous",
      text: "",
    },
  });

  const createComment = api.comment.create.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Comment submitted.",
        description: "Your comment has been successfully submitted.",
      });
    },

    onError: (error) => {
      toast({
        title: "Error submitting comment.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createComment.mutate({
      author_id: 1111,
      post_id: post_id,
      content: values.text,
    });
  }

  return (
    <div className="grid w-full gap-1.5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1 py-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Post your reply" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col items-center">
            <Button
              className="w-full bg-soft-lilac text-slate-800 hover:bg-soft-lilac/80 hover:underline focus:bg-soft-lilac/80 focus:underline"
              variant="secondary"
              disabled={createComment.isLoading}
              type="submit"
            >
              {createComment.isLoading ? "Posting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
