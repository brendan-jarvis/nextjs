import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

export default function HomeButton() {
  return (
    <Button variant="ghost" asChild>
      <Link
        className="flex rounded-md px-3 py-2 font-bold no-underline hover:underline"
        href="/"
      >
        <svg
          aria-label="Vercel logomark"
          role="img"
          viewBox="0 0 74 64"
          className="mr-2 h-4 w-4"
        >
          <path
            d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z"
            fill="currentColor"
          ></path>
        </svg>
        Brendan Jarvis
      </Link>
    </Button>
  );
}
