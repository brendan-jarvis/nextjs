"use client"; // Error components must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen flex-col items-center">
      <h1 className="my-2 bg-citrus-blaze py-2 text-center text-3xl font-bold uppercase">
        Error
      </h1>
      <div className="py-4">
        <p className="mb-2">Something went wrong!</p>
        <pre className="whitespace-pre-wrap rounded border bg-white p-2 text-sm font-light text-red-500">
          {error.message}
        </pre>
      </div>
      <div className="flex flex-row gap-2">
        <Button asChild variant="outline">
          <Link href="/blog" className="underline">
            Back to blog
          </Link>
        </Button>
        <Button
          className="bg-sunny-yellow font-semibold text-gray-700 hover:bg-gray-700 hover:text-sunny-yellow"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
