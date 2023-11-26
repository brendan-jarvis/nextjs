import Link from "next/link";
import { Button } from "@/app/_components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen flex-col items-center">
      <h1 className="my-2 bg-citrus-blaze py-2 text-center text-3xl font-bold uppercase">
        Not found
      </h1>
      <div className="py-4">
        <p>Could not find the requested resource.</p>
      </div>
      <div className="flex flex-row gap-2">
        <Button asChild>
          <Link
            href="/"
            className="bg-seafoam-green text-gray-900 underline hover:bg-gray-700 hover:text-seafoam-green"
          >
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}
