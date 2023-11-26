"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/_components/ui/form";
import { Textarea } from "@/app/_components/ui/textarea"
import { useToast } from "@/app/_components/ui/use-toast"

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  text: z.string().min(3, "Comment must be at least 3 characters long"),
});

type ComponentProps = {
  postId: number;
  session: any | null;
};

export default function AddComment({ session, postId }: ComponentProps) {
  const { toast } = useToast();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const user = session?.user;

  async function getProfile() {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) {
      setLoading(false);
      toast({
        title: "Error fetching profile.",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }

    else {
      setLoading(false);
      form.reset(profile);
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "Anonymous",
      text: "",
    },
  });

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const { error } = await supabase.from("comments").upsert({
      author: session.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      text: values.text,
      author_username: values.username,
      post_id: postId,
    });

    if (error) {
      toast({
        title: "Error submitting comment.",
        description: error.message,
        variant: "destructive"
      });
    }

    else {
      toast({
        title: "Comment submitted.",
        description: "Your comment has been successfully submitted.",
      });

      form.setValue("text", "");
    }
  }

  if (!user) {
    return (
      <div className="mx-auto">
        <h2 className="text-xl font-bold">Comments</h2>
        <p className="text-sm text-gray-600">You must be logged in to comment!</p>
      </div>
    );
  };

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
                  <Textarea disabled={loading} placeholder="Post your reply" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col items-center">
            <Button className="w-full bg-soft-lilac text-slate-800 hover:bg-soft-lilac/80 hover:underline focus:bg-soft-lilac/80 focus:underline" variant="secondary" disabled={loading} type="submit">{loading ? "Posting..." : "Submit"}</Button>
          </div>
        </form>
      </Form>

    </div>
  );
}
