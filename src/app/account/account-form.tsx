"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import Login from "../login/page";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must not exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username must only contain alphanumeric characters and underscores",
    ),
  avatar_url: z.string().url({
    message: "Avatar URL must be a valid URL.",
  }),
});

export default function AccountForm({ session }: { session: any | null }) {
  const { toast } = useToast();
  const supabase = createClient();
  const user = session?.user;
  const [loading, setLoading] = useState(false);

  async function getProfile() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      setLoading(false);
      toast({
        title: "Error fetching profile.",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setLoading(false);
      form.reset(data);
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      avatar_url: "",
    },
  });

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username: values.username,
      avatar_url: values.avatar_url,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      toast({
        title: "Error updating account.",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account updated.",
        description: `Your account has been updated.`,
      });
    }
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Form {...form}>
      <h1 className="mt-4 bg-seafoam-green text-3xl font-bold">Account</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Enter new username."
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your public username.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Enter avatar URL."
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your public avatar URL.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col items-center">
          <Button className="bg-night-plum" disabled={loading} type="submit">
            {loading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
