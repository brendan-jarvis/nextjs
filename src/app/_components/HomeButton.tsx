import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import BJMark from "./BJMark";

export default function HomeButton() {
  return (
    <Button variant="ghost" asChild>
      <Link
        className="flex items-center gap-1.5 rounded-md px-3 py-2 font-bold no-underline hover:underline"
        href="/"
        aria-label="Brendan Jarvis, home"
      >
        <BJMark className="h-5 w-auto shrink-0" />
        Brendan Jarvis
      </Link>
    </Button>
  );
}
