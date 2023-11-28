"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


import { api } from "~/trpc/react";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  text: z.string().min(3, "Comment must be at least 3 characters long"),
});

export function CreateComment({ post_id }: { post_id: number }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const values = { author_id: 1111, post_id: post_id, content: content };

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
      setContent("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createComment.mutate(values);
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Post your reply"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createComment.isLoading}
      >
        {createComment.isLoading ? "Posting..." : "Submit"}
      </button>
    </form>
  );
}
