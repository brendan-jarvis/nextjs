import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

export default function ProjectsButton() {
  return (
    <Button variant="ghost" asChild>
      <Link
        className="rounded-md py-2 font-semibold no-underline hover:underline"
        href="/projects"
      >
        Projects
      </Link>
    </Button>
  );
}
