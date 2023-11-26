import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

export default function BlogButton() {
  return (
    <Button variant="ghost" asChild>
      <Link className="rounded-md py-2 font-semibold no-underline hover:underline" href="/blog">
        Blog
      </Link>
    </Button>
  );
}
