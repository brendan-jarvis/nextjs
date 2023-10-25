import { Button } from "components/ui/button";
import Link from "next/link";

export default function BlogButton() {
  return (
    <Button variant="outline" asChild>
      <Link className="py-2 rounded-md no-underline font-normal" href="/blog">
        Blog
      </Link>
    </Button>
  );
}
