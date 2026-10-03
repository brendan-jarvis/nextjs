"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@/app/_components/ui/button";

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="text-muted-foreground px-3 py-2 text-sm">…</span>;
  }

  if (session?.user) {
    return (
      <Button
        variant="ghost"
        className="rounded-md px-3 py-2 font-semibold"
        onClick={() => void signOut()}
      >
        Sign out
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className="rounded-md px-3 py-2 font-semibold"
      onClick={() => void signIn()}
    >
      Sign in
    </Button>
  );
}
