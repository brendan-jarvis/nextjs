import { Button } from "components/ui/button";
import Link from "next/link";

export default function BlogButton() {
  return (
    <Button variant="outline" asChild>
      <Link className="rounded-md py-2 font-normal no-underline" href="/blog">
        Blog
      </Link>
    </Button>
  );
}
