"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function TRPCDemo() {
  const [name, setName] = useState("from tRPC + Supabase");

  const hello = api.example.hello.useQuery({ text: name });
  const secret = api.example.getSecretMessage.useQuery(undefined, {
    enabled: false, // only fetch on demand or when logged in
  });
  const posts = api.example.getPosts.useQuery();
  const projects = api.example.getProjects.useQuery();

  // Find the motorcycle post (the one with "restricted" in title) for the comment demo
  const motorcyclePost = posts.data?.find(p => p.title?.toLowerCase().includes("restricted"));
  const comments = api.example.getCommentsForPost.useQuery(
    { postId: motorcyclePost?.id ?? 0 }, 
    { enabled: !!motorcyclePost }
  );

  return (
    <div className="bg-card mt-8 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">tRPC + Supabase Demo</h3>
      <p className="text-muted-foreground mt-1 text-sm">
        Example of the restored tRPC layer connected to Supabase.
      </p>

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <button
          className="rounded bg-primary px-4 py-2 text-primary-foreground"
          onClick={() => hello.refetch()}
        >
          Say Hello
        </button>
      </div>

      <div className="mt-3 text-sm">
        {hello.isLoading && "Loading..."}
        {hello.data && <p>{hello.data.greeting}</p>}
        {hello.error && <p className="text-red-500">Error: {hello.error.message}</p>}
      </div>

      <div className="mt-4">
        <button
          className="text-sm underline"
          onClick={() => secret.refetch()}
        >
          Fetch secret message (requires login)
        </button>
        {secret.data && <p className="mt-1 text-green-600">{secret.data}</p>}
        {secret.error && (
          <p className="mt-1 text-sm text-red-500">
            {secret.error.message} (log in via /account)
          </p>
        )}
      </div>

      <div className="mt-4">
        <h4 className="font-medium">Posts from DB (via Drizzle + tRPC):</h4>
        {posts.isLoading && <p>Loading posts...</p>}
        {posts.data && posts.data.length > 0 ? (
          <ul className="mt-1 list-disc pl-5 text-sm">
            {posts.data.map((post) => (
              <li key={post.id}>{post.title || `Post #${post.id}`}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">No posts yet (create table + insert data).</p>
        )}
        {posts.error && <p className="text-red-500 text-sm">Error loading posts: {posts.error.message}</p>}
      </div>

      <div className="mt-4">
        <h4 className="font-medium">Projects from DB (via Drizzle + tRPC):</h4>
        {projects.isLoading && <p>Loading projects...</p>}
        {projects.data && projects.data.length > 0 ? (
          <ul className="mt-1 list-disc pl-5 text-sm">
            {projects.data.map((project) => (
              <li key={project.id}>{project.title || `Project #${project.id}`}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">No projects yet in DB.</p>
        )}
        {projects.error && <p className="text-red-500 text-sm">Error loading projects: {projects.error.message}</p>}
      </div>

      <div className="mt-4">
        <h4 className="font-medium">Comments on the motorcycle post (from Grok via seed):</h4>
        {comments.isLoading && <p>Loading comments...</p>}
        {comments.data && comments.data.length > 0 ? (
          <ul className="mt-1 list-disc pl-5 text-sm">
            {comments.data.map((c) => (
              <li key={c.id}>{c.content}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">No comments yet (or post not found in DB yet).</p>
        )}
        {comments.error && <p className="text-red-500 text-sm">Error: {comments.error.message}</p>}
      </div>

      <p className="text-muted-foreground mt-4 text-xs">
        See <code>src/server/db/schema.ts</code> and <code>src/server/api/routers/example.ts</code>.
        Create the <code>posts</code> and <code>comments</code> tables in Supabase (we can do this with Drizzle + CLI below).
      </p>
    </div>
  );
}
